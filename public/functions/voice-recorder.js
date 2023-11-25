function startRecording() {
    const recordPanel = document.getElementById("record-action-image")
    recordPanel.src = "../assets/images/record-voice.svg";
    //Record voice
    //Send to the server
    //in case of error restart the process
    const startAuthenticationButton = document.getElementById("start-authentication")
    startAuthenticationButton.disabled = false
}

function navigateToAuthentication() {
    window.location.href = `${NODE_APP_URL}/authentication`;
}