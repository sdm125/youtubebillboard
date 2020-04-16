const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const requireHTTPS = (req, res, next) => {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV !== 'development'
  ) {
    return res.redirect('https://www.' + req.get('host') + req.url);
  }
  next();
};
app.use(requireHTTPS);
app.use(express.static('dist'));
app.use('/api/topten/', require('./app/routes/api/topten'));
app.use('/api/video/', require('./app/routes/api/video'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () =>
  console.log('Youtube Billboard listening on port 3000.')
);
