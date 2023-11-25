const User = require('../database/user');

function asyncCreateUser(username, password, voice_sample) { 
  return User.create({ username: username, password: password, voice_sample: voice_sample })
}

function asyncGetUser(username) { 
  return User.findOne({ where: { username: username } });
}

async function updateUserVerificationSample(username, voice_sample) {
  const user = await asyncGetUser(username)
  user.verification_sample = voice_sample;
  await user.save()
}

async function updateUserVoiceSample(username, voice_sample) { 
  const user = await asyncGetUser(username)
  user.voice_sample = voice_sample;
  await user.save()
}

module.exports = { asyncCreateUser, asyncGetUser, updateUserVerificationSample, updateUserVoiceSample };