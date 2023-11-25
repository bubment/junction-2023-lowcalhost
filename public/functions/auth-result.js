const params = (new URL(document.location)).searchParams;
const isSuccess = params.get("success");

if (isSuccess === 'false') {
    const resultImage = document.getElementById('result-img');
    const resultText = document.getElementById('result-text');
    const resultButton = document.getElementById('result-button');

    resultImage.src = "./assets/images/warning-img.svg";
    resultText.innerText = "Authentication failed!";
    resultButton.innerText = "Log out";
}

const redirect = () => {
    window.location.href = `${NODE_APP_URL}/voice-recorder`;
};