const express = require('express');
const router = express.Router();
const billboard = require('billboard-top-100').getChart;
const moment = require('moment');

const errMsg = {
  'chart': {'error': 'chart not found'},
  'date': {'error': 'invalid date'}
};

const getTopTen = (date) => {
  let topTen = [];
  return new Promise((resolve, reject) => {
  //   billboard('hot-100', date, (err, data) => {
  //     console.log(data)
  //     if (err) return reject(err)
  //     console.log('Getting billboard data...')

  let data = { songs:
    [ { rank: 1,
        title: 'Old Town Road',
        artist: 'Lil Nas X Featuring Billy Ray Cyrus',
        cover:
         'https://charts-static.billboard.com/img/2019/03/lil-nas-x-8wa-174x174.jpg',
        position: [Object] },
      { rank: 2,
        title: 'Bad Guy',
        artist: 'Billie Eilish',
        cover:
         'https://charts-static.billboard.com/img/2019/04/billie-eilish-1e3-bad-guy-g9n-174x174.jpg',
        position: [Object] },
      { rank: 3,
        title: 'Senorita',
        artist: 'Shawn Mendes & Camila Cabello',
        cover:
         'https://charts-static.billboard.com/img/2019/06/shawn-mendes-drf-senorita-q1f-174x174.jpg',
        position: [Object] },
      { rank: 4,
        title: 'Truth Hurts',
        artist: 'Lizzo',
        cover:
         'https://charts-static.billboard.com/img/2019/05/lizzo-w3u-truth-hurts-tmm-174x174.jpg',
        position: [Object] },
      { rank: 5,
        title: 'Talk',
        artist: 'Khalid',
        cover:
         'https://charts-static.billboard.com/img/2019/02/khalid-dsk-talk-1dz-174x174.jpg',
        position: [Object] },
      { rank: 6,
        title: 'No Guidance',
        artist: 'Chris Brown Featuring Drake',
        cover:
         'https://charts-static.billboard.com/img/2019/06/chris-brown-cte-no-guidance-yi0-174x174.jpg',
        position: [Object] },
      { rank: 7,
        title: 'I Don\'t Care',
        artist: 'Ed Sheeran & Justin Bieber',
        cover:
         'https://charts-static.billboard.com/img/2019/05/ed-sheeran-3vg-i-dont-care-w7v-174x174.jpg',
        position: [Object] },
      { rank: 8,
        title: 'Boyfriend',
        artist: 'Ariana Grande & Social House',
        cover:
         'https://charts-static.billboard.com/img/2019/08/ariana-grande-ypy-boyfriend-bab-174x174.jpg',
        position: [Object] },
      { rank: 9,
        title: 'Goodbyes',
        artist: 'Post Malone Featuring Young Thug',
        cover:
         'https://charts-static.billboard.com/img/2019/07/post-malone-tp6-goodbyes-k3y-174x174.jpg',
        position: [Object] },
      { rank: 10,
        title: 'Ran$om',
        artist: 'Lil Tecca',
        cover:
         'https://charts-static.billboard.com/img/2019/06/lil-tecca-000-ran$om-wsn-174x174.jpg',
        position: [Object] }],
      week: '2019-08-17',
      previousWeek:
        { url: 'http://www.billboard.com/charts/hot-100/2019-08-10',
          date: '2019-08-10' },
      nextWeek: { url: '', date: '' } };

      for(let i = 0; i < 10; i++) {
        console.log('Retrieved ' + data.songs[i].artist + ':' + data.songs[i].title);
        topTen.push(data.songs[i]);
      }
      resolve(topTen);
    // });
  });
};

router.get('/date', (req, res) => {
  let month = req.query.month < 10 ? `0${req.query.month}` : req.query.month;
  let day = req.query.day < 10 ? `0${req.query.day}` : req.query.day;
  let year = req.query.year;
  let date = `${year}-${month}-${day}`;

  // Validate date
  if (moment(date).isValid() && moment(moment(new Date()).diff(date, 'days')) >= 0) {
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

module.exports = router;
