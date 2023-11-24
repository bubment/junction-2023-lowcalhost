function login(username, password) {
    //Request the db for this user
    const MOCK_LOGIN_CORRECT = true;

    return {
        success: MOCK_LOGIN_CORRECT,
        message: MOCK_LOGIN_CORRECT ? "" : "This account is already in use with different passoword"
    }
}

module.exports = { login } 