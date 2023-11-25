const User = require('../database/user');

function asyncCreateUser(username, password, voice_sample) { 
  return User.create({ username: username, password: password, voice_sample: voice_sample })
}

function asyncGetUser(username) { 
  return User.findOne({ where: { username: username } });
}

module.exports = { asyncCreateUser, asyncGetUser };