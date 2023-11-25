const params = (new URL(document.location)).searchParams;
const isSuccess = params.get("success");

const resultImage = document.getElementById('result-img');
const resultText = document.getElementById('result-text');
const resultButton = document.getElementById('result-button');

let redirectLink = `${NODE_APP_URL}/voice-recorder`;

const localStorageService = new LocalStorageService();
const resultState = localStorageService.getItem("authResultState");

if (resultState.isStart) {
    resultImage.src = "./assets/images/greenwarning-img.svg";
    resultText.innerText = "On the next page we will perform voice-based verification, please answer the questions out loud!";
    resultButton.innerText = "Let's start";
    redirectLink = `${NODE_APP_URL}/authentication`;
} else {
    if (!resultState.isError) {
        resultImage.src = "./assets/images/success-img.svg";
        resultText.innerText = "Successful authentication!";
        resultButton.innerText = "Done";
    } else {
        if (resultState.retryCount > 0) {
            resultImage.src = "./assets/images/warning-img.svg";
            resultText.innerText = `Identification failed! You have ${resultState.retryCount} chance to try again!`;
            resultButton.innerText = "Try Again";
            redirectLink = `${NODE_APP_URL}/authentication`;
        } else {
            resultImage.src = "./assets/images/warning-img.svg";
            resultText.innerText = "Authentication failed!";
            resultButton.innerText = "Log out";
        }
    }
}

const redirect = () => {
    window.location.href = redirectLink;
};