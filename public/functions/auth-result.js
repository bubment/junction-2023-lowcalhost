const params = (new URL(document.location)).searchParams;
const isSuccess = params.get("success");

const resultImage = document.getElementById('result-img');
const resultText = document.getElementById('result-text');
const resultButton = document.getElementById('result-button');

if (isSuccess === 'true') {
    resultImage.src = "./assets/images/success-img.svg";
    resultText.innerText = "Successful authentication!";
    resultButton.innerText = "Done";
} else {
    resultImage.src = "./assets/images/warning-img.svg";
    resultText.innerText = "Authentication failed!";
    resultButton.innerText = "Log out";
}

const redirect = () => {
    window.location.href = `${NODE_APP_URL}/voice-recorder`;
};