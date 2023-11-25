function logout() {
    // [TODO]: Clean the related local storage info
    window.location.href = `${NODE_APP_URL}/login`;
}

function activateLoader() {
    const loader = document.getElementById("loader-container");
    loader.style.display = "flex";
}

function deactivateLoader() {
    const loader = document.getElementById("loader-container");
    loader.style.display = "none";
}

async function fakeWait(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}