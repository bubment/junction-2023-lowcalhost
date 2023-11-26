const localStorageService = new LocalStorageService();
localStorageService.clear();

async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    console.log(username, password);

    if (!username || !password) {
        showErrorMessage("Please fill all input fields!");
    } else {
        const randomizedUserId = Math.floor(Math.random() * 999999) + 100000;
        const extendedUser = `${username}-${randomizedUserId}`;

        const loginReqBody = { extendedUser, password };
        activateLoader();
        await fakeWait(1500);
        const response = await fetch(`${NODE_APP_URL}/api/login`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify(loginReqBody),
        });
        const result = await response.json();
        deactivateLoader();
        if (result.success) {
            localStorageService.setItem("username", extendedUser);
            window.location.href = `${NODE_APP_URL}/voice-recorder`;
        } else {
            showErrorMessage(result.message);
        }
    }
}

function showErrorMessage(message) {
    const errorMessageContainer = document.getElementById("error-msg-container");
    const errorMessageElement = document.getElementById("error-msg");
    errorMessageElement.innerHTML = message;
    errorMessageContainer.style.display = "block";
}

function hideErrorMessagee() {
    const errorMessageContainer = document.getElementById("error-msg-container");
    errorMessageContainer.style.display = "none";
}