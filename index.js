const express = require('express');
const path = require('path');
var cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;

const services = require('./services');

app.use(cors())
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload());

app.set('views', path.join(__dirname, 'public'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.post('/api/login', (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const loginResponse = services.login(username, password);
  res.send(loginResponse);
});

app.post('/api/validateAudio', async (req, res) => {
  const answer = req.body.answer;
  const username = req.body.username;
  const blobData = req.files.file.data;
  const response = await services.validateAudio(blobData, answer, username);
  res.send(response);
});

app.post('/api/saveAudio', async (req, res) => {
  const blobData = req.files.file.data;
  const username = req.body.username;
  const response = await services.saveInitialAudio(blobData, username);
  res.send(response);
});

app.get('/', (req, res) => {
  res.render('login.html');
});

app.get('/login', (req, res) => {
  res.render('login.html');
});

app.get('/voice-recorder', (req, res) => {
  res.render('voice-recorder.html');
});

app.get('/authentication', (req, res) => {
  res.render('authentication.html');
});

app.get('/auth-result', (req, res) => {
  res.render('auth-result.html');
});

app.get('/auth-stats', (req, res) => {
  res.render('auth-stats.html');
});

const hostname = "localhost"

app.listen(port, hostname,() => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
