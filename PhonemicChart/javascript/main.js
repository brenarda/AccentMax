function PlaySound(buttonNumber) {
    var audioName = document.getElementById("button-"+buttonNumber+"").querySelector("p").innerHTML;
    var audio = new Audio("./phonemic_chart/"+ audioName +".mp3");
    audio.play();
}

function CloseTerms() {
    document.getElementById("terms-container").style.display = "none"
 }
 function ShowTerms() {
    document.getElementById("terms-container").style.display = "block"
 }