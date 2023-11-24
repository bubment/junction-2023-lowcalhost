const express = require('express');
const path = require('path'); 
const app = express();
const port = 3000;


app.use(express.static('public'));


app.set('views', path.join(__dirname, 'public'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});