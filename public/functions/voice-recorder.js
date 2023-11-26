const localStorageService = new LocalStorageService();
localStorageService.setItem('authResultState', { isError: false, isStart: true, retryCount: 3 });

let usernameContainer = document.getElementById("username-container");
usernameContainer.innerText = localStorageService.getItem("username");

let isRunning = false;
let mediaRecorder;
let audioChunks = [];

function startRecording() {
    if (isRunning == true) {
        stopMediaRecorder();
        const startAuthenticationButton = document.getElementById("start-authentication");
        startAuthenticationButton.disabled = false;

        const recordPanel = document.getElementById("record-action-image");
        recordPanel.src = "../assets/images/correct.svg";

        const voiceRecorderInstruction = document.getElementById("voice-recorder-instruction");
        voiceRecorderInstruction.innerHTML = "Thank you, you can now start the authentication process!";
        voiceRecorderInstruction.classList.remove("font-bold");
    } else {
        isRunning = true;

        const voiceRecorderInstruction = document.getElementById("voice-recorder-instruction");
        voiceRecorderInstruction.innerHTML = "You only live once, but if you do it right, once is enough.";
        voiceRecorderInstruction.classList.add("font-bold");

        const recordPanel = document.getElementById("record-action-image");
        recordPanel.src = "../assets/images/record-voice.gif";

        startMediaRecorder();
    }
}

function startMediaRecorder() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                console.log("Recording stopped.");
                saveInitialRecording(new Blob(audioChunks, { type: 'audio/wav' }));
                audioChunks = [];
            };

            mediaRecorder.start();
            console.log("Recording started.");
        })
        .catch(error => {
            console.error("Error accessing microphone:", error);
        });
};

function stopMediaRecorder() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

function saveInitialRecording(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('username', localStorageService.getItem('username'));
    activateLoader();
    fetch('http://127.0.0.1:3000/api/saveAudio', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Error sending to server:', error);
        })
        .finally(() => {
            deactivateLoader();
        });
}

function navigateToAuthentication() {
    window.location.href = `${NODE_APP_URL}/auth-result`;
}