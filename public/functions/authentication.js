let mediaRecorder;
let audioBlob;
let audioChunks = [];
let countdownInterval;
let currentCount = 1;
const MAX_COUNT = 2;

const localStorageService = new LocalStorageService();
localStorageService.setItem('authResultState', { ...localStorageService.getItem('authResultState'), isStart: false });

const initCountdownInterval = (countdownValue) => {
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = `00:0${countdownValue}`;
    countdownValue--;

    countdownInterval = setInterval(() => {
        countdownElement.textContent = `00:0${countdownValue}`;
        countdownValue--;

        if (countdownValue < 0) {
            clearInterval(countdownInterval);
            stopRecording();
            countdownElement.textContent = "";
        }
    }, 1000);
};

const startRecording = () => {
    initCountdownInterval(3);
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                console.log("Recording stopped.");
                sendToServer();
            };

            mediaRecorder.start();
            console.log("Recording started.");
        })
        .catch(error => {
            console.error("Error accessing microphone:", error);
        });
};

const stopRecording = () => {
    const countdownElement = document.getElementById('countdown');

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        clearInterval(countdownInterval);
        countdownElement.textContent = "";
    }
};

const sendToServer = () => {
    startLoading();
    const formData = new FormData();
    formData.append('file', audioBlob);

    fetch('http://localhost:3000/api/validateAudio', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            setTimeout(() => {
                stopLoading();
                console.log("Server response:", result);
                result;
                if (result == 'true') {
                    if (currentCount <= MAX_COUNT) {
                        currentCount++;
                        console.log('switch image'); //TODO
                        startRecording();
                    } else {
                        localStorageService.setItem('authResultState', { ...localStorageService.getItem('authResultState'), isError: false });
                        window.location.href = `${NODE_APP_URL}/auth-result`;
                    }
                } else {
                    localStorageService.setItem('authResultState', { ...localStorageService.getItem('authResultState'), isError: true });
                    window.location.href = `${NODE_APP_URL}/auth-result`;
                }
            }, 1500);
        })
        .catch(error => {
            console.error('Error sending to server:', error);
        });
};

const startLoading = () => {
    document.getElementById("loadingIcon").style.display = "block";
};

const stopLoading = () => {
    document.getElementById("loadingIcon").style.display = "none";
};

startRecording();