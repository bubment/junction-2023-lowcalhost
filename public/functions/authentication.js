let mediaRecorder;
let audioBlob;
let currentAnswer;
let audioChunks = [];
let countdownInterval;
let currentCount = 1;
const MAX_COUNT = 2;
const AUTH_INTERVAL = 3;

const localStorageService = new LocalStorageService();
const state = localStorageService.getItem('authResultState');
localStorageService.setItem('authResultState', { ...state, isStart: false, retryCount: state.retryCount - 1 });

const initCountdownInterval = (countdownValue) => {
    const countdownElement = document.getElementById('auth-countdown');
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
    initCountdownInterval(AUTH_INTERVAL);
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
    const countdownElement = document.getElementById('auth-countdown');

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
    formData.append('answer', currentAnswer);

    fetch('http://localhost:3000/api/validateAudio', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            // remove timeout, add loader
            setTimeout(() => {
                stopLoading();
                if (result == 'true') {
                    if (currentCount < MAX_COUNT) {
                        currentCount++;
                        switchImage();
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

const switchImage = () => {
    const authTest = testArray[Math.floor(Math.random() * testArray.length)];
    const authQuestion = document.getElementById("auth-question");
    const authImage = document.getElementById("auth-img");

    currentAnswer = authTest.answer;

    authQuestion.innerHTML = authTest.question;
    authImage.src = authTest.asset;
};

const startLoading = () => {
    //document.getElementById("loadingIcon").style.display = "block";
};

const stopLoading = () => {
    //document.getElementById("loadingIcon").style.display = "none";
};

switchImage();
startRecording();