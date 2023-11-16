const express = require('express');
const path = require('path'); 
const app = express();
const port = 3000;


app.use(express.static('public'));


app.set('views', path.join(__dirname, 'public'));


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/about', (req, res) => {
  res.render('about.html');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});