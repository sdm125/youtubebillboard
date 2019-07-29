const express = require('express');
const app = express();
const env = require('dotenv').config();
const path = require('path');
const billboard = require('billboard-top-100').getChart;
const moment = require('moment');

const errMsg = {'chart':{'error':'chart not found'}, 'date': {'error': 'invalid date'}};

const getTopTen = (date) => {
  let topTen = [];
  return new Promise((resolve, reject) => {
    billboard('hot-100', date, (err, data) => {
      if (err) return reject(err)
      console.log('Getting billboard data...')
      for(let i = 0; i < 10; i++) {
        console.log('Retrieved ' + data.songs[i].artist + ':' + data.songs[i].title);
        topTen.push(data.songs[i]);
      }
      resolve(topTen);
    });
  });
};

app.get('/api/date', (req, res) => {
  let month = req.query.month < 10 ? `0${req.query.month}` : req.query.month;
  let day = req.query.day < 10 ? `0${req.query.day}` : req.query.day;
  let year = req.query.year;
  let date = `${year}-${month}-${day}`;

  // Validate date
  if (moment(date).isValid() && moment(moment(new Date()).diff(date, 'days')) > 0) {
    getTopTen(date).then((topTen) => {
      res.send(topTen);
    }).catch(e => {
      console.log(errMsg['chart']);
      res.send(errMsg['chart']);
    });
    console.log(date);
  }
  else {
    res.send(errMsg['date']);
  }
});

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Youtube Billboard listening on port 3000.'));
