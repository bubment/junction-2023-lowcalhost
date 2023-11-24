const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function login(username, password) {
    //Request the db for this user
    const MOCK_LOGIN_CORRECT = true;

    return {
        success: MOCK_LOGIN_CORRECT,
        message: MOCK_LOGIN_CORRECT ? "" : "This account is already in use with different passoword"
    };
}

function validateAudio(blob) {
    const wavFilePath = 'temp.wav';
    fs.writeFileSync(wavFilePath, Buffer.from(blob, 'base64'));
    const finalPath = 'output.wav';

    ffmpeg()
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

    return (Math.random() > 0.5);
}


module.exports = { login, validateAudio }; 