const localStorageService = new LocalStorageService();
localStorageService.setItem('authResultState', { isError: false, isStart: true, retryCount: 2 });

function startRecording() {
    //Change the image in the record panel
    const recordPanel = document.getElementById("record-action-image");
    recordPanel.src = "../assets/images/record-voice.svg";
    // Change the instruction text to sample text
    const voiceRecorderInstruction = document.getElementById("voice-recorder-instruction");
    voiceRecorderInstruction.innerHTML = "You only live once, but if you do it right, once is enough.";
    voiceRecorderInstruction.classList.add("font-bold");
    // [TODO]
    //Record voice
    //Send to the server
    //in case of error restart the process
    const startAuthenticationButton = document.getElementById("start-authentication");
    startAuthenticationButton.disabled = false;
}

function navigateToAuthentication() {
    window.location.href = `${NODE_APP_URL}/auth-result`;
}