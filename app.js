const express = require('express');
const app = express();
const env = require('dotenv').config();
const path = require('path');
const billboard = require('billboard-top-100').getChart;
const moment = require('moment');
const search = require('youtube-search');
const errMsg = {'chart':{'errpr':'chart not found'}, 'date': {'error': 'invalid date'}};
const youtubeOpts = {
  maxResults: 1,
  key: process.env.YOUTUBE_KEY
};

const getTopTen = (date) => {
  let topTen = [];
  return new Promise((resolve, reject) => {
    billboard('hot-100', date, (err, songs) => {
      console.log(songs)
      if (err) return reject(err)
      console.log('Getting billboard data...')
      for(let i = 0; i < 10; i++) {
        console.log('Retrieved ' + songs[i].artist + ':' + songs[i].title);
        topTen.push(songs[i]);
      }
      resolve(topTen);
    });
  });
};

const getYoutubeLink = (topTen) => {
  let youtubePromises = [];
  console.log('Getting YouTube data...');

  topTen.forEach((song, index) => {
    youtubePromises.push(new Promise((resolve, reject) => {
      search(song.artist + ' ' + song.title, youtubeOpts, (err, youtubeData) => {
        if (err) console.log(err);
        console.log('Retrieved: ' + song.artist + ': ' + song.title)
        song['youtube'] = 'https://www.youtube.com/embed/' + youtubeData[0].id;
        resolve(song);
      });
    }));
  });

  return youtubePromises;
};

app.get('/api/date', (req, res) => {
  let month = req.query.month < 10 ? `0${req.query.month}` : req.query.month;
  let day = req.query.day < 10 ? `0${req.query.day}` : req.query.day;
  let year = req.query.year;
  let date = `${year}-${month}-${day}`;

  // Validate date
  if (moment(date).isValid() && moment(moment(new Date()).diff(date, 'days')) > 0) {
    getTopTen(date).then((topTen) => {
      Promise.all(getYoutubeLink(topTen)).then((links) => {
        res.send(links);
      }).catch(() => {
        console.log(errMsg['chart']);
        res.send(errMsg['chart']);
      })
    }).catch((e) => {
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
