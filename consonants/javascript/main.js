function WriteWords(i, underlineLetter, underlineBRE, appendLocation, word, page, index) {
    underlineLetter = "";
    var wordContainer = document.createElement("div");
    wordContainer.setAttribute("class", "word-line");
    wordContainer.setAttribute("id", "word-line-"+ index +"");

    var wordWrapper = document.createElement("div");
    wordWrapper.setAttribute("class", "word-wrapper");
    wordWrapper.setAttribute("id", "word-wrapper-"+ index +"");
    
    var wordCreation = document.createElement("span");
    wordCreation.setAttribute("class", "center");
    wordCreation.innerHTML = word;

    var favoriteIcon = document.createElement("img");
    favoriteIcon.setAttribute("id", "favorite-icon-"+ index +"");
    favoriteIcon.setAttribute("onclick", "ChangeImg("+ i +", "+page+", "+index+")");
    if(localStorage.getItem("favorite-icon-"+ i +"") == 1 || favoriteWordsVisible) {
        favoriteIcon.setAttribute("src", "images/favorite-icon-active.png");
        favoriteIcon.setAttribute("class", "active");
    } else {
        favoriteIcon.setAttribute("src", "images/favorite-icon.png");
    }

    var breWrapper = document.createElement("div");
    breWrapper.setAttribute("class", "bre-wrapper");
    breWrapper.setAttribute("id", "bre-wrapper-"+ index +"");

    var breElement = document.createElement("span");
    breElement.setAttribute("class", "center");
    breElement.innerHTML = document.getElementById("specific-content-"+page+"").querySelector("#bre-wrapper-"+i+"").querySelector(".center").innerHTML;

    var speakerIconBRE = document.createElement("img");
    speakerIconBRE.setAttribute("onclick", "SpeakWord("+ index +")");
    speakerIconBRE.setAttribute("src", "images/Speaker_Icon.png");

    var translation = document.createElement("p");
    translation.setAttribute("class", "center");
    translation.innerHTML = document.getElementById("specific-content-"+page+"").querySelector("#word-line-"+i+"").querySelectorAll(".center")[2].innerHTML;
    
    document.getElementById(appendLocation).appendChild(wordContainer);
    document.getElementById("word-line-"+ index +"").appendChild(wordWrapper);
    document.getElementById("word-wrapper-"+ index +"").appendChild(favoriteIcon);
    document.getElementById("word-wrapper-"+ index +"").appendChild(wordCreation);
    document.getElementById("word-line-"+ index +"").appendChild(breWrapper);
    document.getElementById("bre-wrapper-"+ index +"").appendChild(speakerIconBRE);
    document.getElementById("bre-wrapper-"+ index +"").appendChild(breElement);
    document.getElementById("word-line-"+ index +"").appendChild(translation);
}

function OpenMenu() {
    document.getElementById("sidebar-menu").style.left = "0"
    document.getElementById("main-content").style.filter = "blur(10px)";
}

function CloseMenu() {
    document.getElementById("sidebar-menu").style.left = "-250px"
    document.getElementById("main-content").style.filter = "none";
}

var lastActiveButton = 0;

function RemoveWords(removeLocation) {
    const parent = document.getElementById(removeLocation);
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}

function SelectConsonant(consonantNumber) {
    document.getElementById("button-"+lastActiveButton+"").classList.remove("letter-active");
    document.getElementById("button-"+consonantNumber+"").classList.add("letter-active");
    document.getElementById("specific-content-"+lastActiveButton+"").style.display = "none";
    document.getElementById("specific-content-"+consonantNumber+"").style.display = "flex";
    lastActiveButton = consonantNumber;
}

function SpeakWord(wordNumber) {
    let msg;
    if(!favoriteWordsVisible) {
        msg = document.getElementById("specific-content-"+lastActiveButton+"").querySelector("#word-wrapper-"+wordNumber+"").querySelector(".center").innerHTML;
    } else {
        msg = document.getElementById("favorite-words").querySelector("#word-wrapper-"+wordNumber+"").querySelector(".center").innerHTML;
    }
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en-GB";       
    speech.text = msg;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;    
    window.speechSynthesis.speak(speech);
}

var savedWords = [];
var savedPage = [];
var savedId = [];
var favoriteWordsVisible = false;

function ChangeImg(imgNumber, pageNumber, index) {
    if(favoriteWordsVisible) {
        document.getElementById("specific-content-"+pageNumber+"").querySelector('#words-list').querySelector('#favorite-icon-'+imgNumber+'').classList.remove("active");
        document.getElementById("specific-content-"+pageNumber+"").querySelector('#words-list').querySelector('#favorite-icon-'+imgNumber+'').src = "images/favorite-icon.png";
        document.querySelector('#append-words-favorite').querySelector('#word-line-'+index+'').remove();
    } else {
        if(document.getElementById("specific-content-"+lastActiveButton+"").querySelector("#favorite-icon-"+ imgNumber +"").classList.contains("active")) {
            document.getElementById("specific-content-"+lastActiveButton+"").querySelector("#favorite-icon-"+ imgNumber +"").src = "images/favorite-icon.png"
            document.getElementById("specific-content-"+lastActiveButton+"").querySelector("#favorite-icon-"+ imgNumber +"").classList.remove("active");
            localStorage.removeItem("favorite-icon-"+ imgNumber +"-"+pageNumber+"");
        } else {
            document.getElementById("specific-content-"+lastActiveButton+"").querySelector("#favorite-icon-"+ imgNumber +"").src = "images/favorite-icon-active.png"
            document.getElementById("specific-content-"+lastActiveButton+"").querySelector("#favorite-icon-"+ imgNumber +"").classList.add("active");
            localStorage.setItem("favorite-icon-"+ imgNumber +"-"+pageNumber+"", 1);
        }
    }
}

function ShowFavorites() {
    if(!favoriteWordsVisible) {
        document.getElementById("favorite-words").style.display = "initial";
        document.getElementById("main-content").style.filter = "blur(10px)";
        favoriteWordsVisible = true;
        savedWords = [];
        savedPage = [];
        savedId = [];
        for (let i = 0; i < document.getElementsByClassName("active").length; i++) {
            savedId.push(document.getElementsByClassName("active")[i].parentNode.parentNode.id.replace(/[^0-9]/g,''));
            savedWords.push(document.getElementsByClassName("active")[i].parentNode.querySelector(".center").innerHTML);
            savedPage.push(document.getElementsByClassName("active")[i].parentNode.parentNode.parentNode.parentNode.parentNode.id.replace(/[^0-9]/g,''));
        }
        RemoveWords("append-words-favorite");
        for (let i = 0; i < savedWords.length; i++) {
            WriteWords(savedId[i], "", false, "append-words-favorite", savedWords[i], savedPage[i], i);
        }
    } else {
        favoriteWordsVisible = false;
        RemoveWords("append-words-favorite");
        document.getElementById("favorite-words").style.display = "none";
        document.getElementById("main-content").style.filter = "none";
    }
}

function PlaySound(soundNumber) {
    var audioName = document.getElementById("specific-content-"+lastActiveButton+"").getElementsByClassName("sound-container")[soundNumber].querySelector("#letter-sound-"+soundNumber+"").innerHTML;
    var audio = new Audio("./consonants_BrE/"+ audioName +".mp3");
    audio.play();
}

setTimeout(() => {
    var childs;
    var pages = document.getElementsByClassName("specific-content");
    for (let index = 0; index < pages.length; index++) {
        childs = document.getElementById("specific-content-"+index+"").querySelector("#words-list").getElementsByClassName("word-line");
        for (let i = 0; i < childs.length; i++) {
            if(localStorage.getItem("favorite-icon-"+ i +"-"+index+"") == 1) {
                document.getElementById("specific-content-"+index+"").querySelector("#favorite-icon-"+ i +"").src = "images/favorite-icon-active.png"
                document.getElementById("specific-content-"+index+"").querySelector("#favorite-icon-"+ i +"").classList.add("active");
            }
        }
    }
}, 200);

for (let i = 0; i < document.getElementsByTagName("video").length; i++) {
    document.getElementsByTagName("video")[i].addEventListener('ended', function() {
        document.getElementsByTagName("video")[i].removeAttribute("controls","controls");
        document.getElementById("specific-content-"+i+"").querySelector("#play-pause").innerHTML = "&#9658;";
        setTimeout(() => {
            var value = (100 / document.getElementsByTagName("video")[i].duration) * document.getElementsByTagName("video")[i].currentTime;
            document.getElementById("specific-content-"+i+"").querySelector("#seek-bar").value = value;
        }, 50);
    });
    document.getElementsByTagName("video")[i].addEventListener('loadeddata', function() {
        setTimeout(() => {
            var value = (100 / document.getElementsByTagName("video")[i].duration) * document.getElementsByTagName("video")[i].currentTime;
            document.getElementById("specific-content-"+i+"").querySelector("#seek-bar").value = value;
        }, 50);
    }, false);
    document.getElementById("specific-content-"+i+"").querySelector("#play-pause").addEventListener("click", function() {
        if (document.getElementById("specific-content-"+i+"").querySelector('#video').paused == true) {
          document.getElementById("specific-content-"+i+"").querySelector('#video').play();
      
          document.getElementById("specific-content-"+i+"").querySelector("#play-pause").innerHTML = "&#10074;&#10074;";
        } else {
          document.getElementById("specific-content-"+i+"").querySelector('#video').pause();
      
          document.getElementById("specific-content-"+i+"").querySelector("#play-pause").innerHTML = "&#9658;";
        }
    });
    document.getElementsByTagName("video")[i].addEventListener("timeupdate", function() {
        var value = (100 / document.getElementsByTagName("video")[i].duration) * document.getElementsByTagName("video")[i].currentTime;
        document.getElementById("specific-content-"+i+"").querySelector("#seek-bar").value = value;
    });
    document.getElementById("specific-content-"+i+"").querySelector("#seek-bar").addEventListener("change", function() {
        var time = document.getElementsByTagName("video")[i].duration * (document.getElementById("specific-content-"+i+"").querySelector("#seek-bar").value / 100);
        document.getElementsByTagName("video")[i].currentTime = time;
    });
    document.getElementById("specific-content-"+i+"").querySelector("#mute").addEventListener("click", function() {
        if (document.getElementsByTagName("video")[i].muted == false) {
          document.getElementsByTagName("video")[i].muted = true;
          document.getElementById("specific-content-"+i+"").querySelector("#mute").innerHTML = '<img src="./images/mute-icon-video.png">';
        } else {
          document.getElementsByTagName("video")[i].muted = false;
          document.getElementById("specific-content-"+i+"").querySelector("#mute").innerHTML = '<img src="./images/speaker-icon-video.png">';
        }
    });
    document.getElementById("specific-content-"+i+"").querySelector("#volume-bar").addEventListener("change", function() {
        document.getElementsByTagName("video")[i].volume = document.getElementById("specific-content-"+i+"").querySelector("#volume-bar").value;
    });
}

function ChangeLetter(letterNumber) {
    var video = document.getElementById("specific-content-"+lastActiveButton+"").querySelector('#video');
    var source = document.getElementById("specific-content-"+lastActiveButton+"").querySelector('#source');
    var audioName = document.getElementById("specific-content-"+lastActiveButton+"").getElementsByClassName("sound-container")[letterNumber].querySelector("#letter-sound-"+letterNumber+"").innerHTML;
    if(!source.src.includes(""+ audioName +".mp4")) {
        source.setAttribute('src', "video_consonants/"+ audioName +".mp4");
        video.removeAttribute("controls","controls");
        video.setAttribute("poster","./thumbnails/"+ audioName +".png");
        video.load();
    }
    var teste = document.getElementById("specific-content-"+lastActiveButton+"").querySelectorAll(".sound-container");
    for (let i = 0; i < teste.length; i++) {
        teste[i].classList.remove("sound-selected");
    }
    teste[letterNumber].classList.add("sound-selected");
}