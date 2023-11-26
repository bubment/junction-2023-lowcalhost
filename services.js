const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const user = require('./public/functions/user');
ffmpeg.setFfmpegPath(ffmpegPath);

async function login(username, password) {
    const MOCK_LOGIN_CORRECT = true;

    return {
        success: MOCK_LOGIN_CORRECT,
        message: MOCK_LOGIN_CORRECT ? "" : "This account is already in use with different passoword"
    };
}

async function validateAudio(blob, answer, username) {
    const wavFilePath = username+'temp2.wav';
    fs.writeFileSync(wavFilePath, Buffer.from(blob, 'base64'));
    const finalPath = username+'validation_output.wav';

    await ffmpeg()
        .input(wavFilePath)
        .audioCodec('libmp3lame')
        .toFormat('wav')
        .on('end', () => {
            console.log('Conversion finished!');
            fs.unlinkSync(wavFilePath);
        })
        .on('error', (err) => {
            console.error('Error:', err);
            fs.unlinkSync(wavFilePath);
        })
        .save(finalPath);
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1000)
    file = fs.readFileSync(finalPath);
    
    await user.updateUserVerificationSample(username, file);

    const formData = new FormData();
    formData.append('username', username);

    const verificationResponse = await fetch('https://juncition2023.azurewebsites.net/verify', {
        method: 'POST',
        body: formData,
    });

    const transcriptionResponse = await fetch('https://juncition2023.azurewebsites.net/transcribe', {
        method: 'POST',
        body: formData,
    });

    const userIsVerified = await verificationResponse.json();
    const userAnswer = await transcriptionResponse.json();
    console.log(userIsVerified.user_verified, userAnswer.text, answer.toLowerCase());
    console.log(userIsVerified.user_verified && userAnswer.text === answer.toLowerCase())
    // we can return this separately
    // return true;
    return userIsVerified.user_verified && userAnswer.text === answer.toLowerCase();
}

async function saveInitialAudio(blob, username) {
    //save in db

    const wavFilePath = username+'temp.wav';
    fs.writeFileSync(wavFilePath, Buffer.from(blob, 'base64'));
    const finalPath = username+'initial_output.wav';

    await ffmpeg()
        .input(wavFilePath)
        .audioCodec('libmp3lame')
        .toFormat('wav')
        .on('end', () => {
            console.log('Conversion finished!');
            fs.unlinkSync(wavFilePath);
        })
        .on('error', (err) => {
            console.error('Error:', err);
            fs.unlinkSync(wavFilePath);
        })
        .save(finalPath);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1000)
    file = fs.readFileSync(finalPath);
    
    await user.updateUserVoiceSample(username, file);
}


module.exports = { login, validateAudio, saveInitialAudio }; 