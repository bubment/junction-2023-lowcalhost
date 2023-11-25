const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const user = require('./public/functions/user');
ffmpeg.setFfmpegPath(ffmpegPath);

function login(username, password) {
    //Request the db for this user
    const MOCK_LOGIN_CORRECT = true;

    return {
        success: MOCK_LOGIN_CORRECT,
        message: MOCK_LOGIN_CORRECT ? "" : "This account is already in use with different passoword"
    };
}

async function validateAudio(blob, answer, username) {
    const wavFilePath = 'temp2.wav';
    fs.writeFileSync(wavFilePath, Buffer.from(blob, 'base64'));
    const finalPath = 'validation_output.wav';

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

    const verificationResponse = await fetch('http://127.0.0.1:5000/verify', {
        method: 'POST',
        body: formData,
    });

    const transcriptionResponse = await fetch('http://127.0.0.1:5000/transcribe', {
        method: 'POST',
        body: formData,
    });

    const userIsVerified = await verificationResponse.json();
    const userAnswer = await transcriptionResponse.json();

    // we can return this separately
    return userIsVerified.user_verified && userAnswer.text === answer.toLowerCase();
}

async function saveInitialAudio(blob, username) {
    //save in db
    const wavFilePath = 'temp.wav';
    fs.writeFileSync(wavFilePath, Buffer.from(blob, 'base64'));
    const finalPath = 'initial_output.wav';

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