const express = require('express');
const router = express.Router();
const db = require('../../database');
const axios = require('axios');
require('dotenv').config();
const puppeteer = require('puppeteer');
const selector = 'ytd-search ytd-thumbnail a';

const getVideoIdFromWeb = async (q) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.SEARCH_URL}${encodeURIComponent(q)}`, {waitUntil: 'networkidle0'});
  await page.waitForSelector(selector);
  let id = await page.$eval(selector, el => el.getAttribute('href').split('v=')[1]);
  browser.close();
  return id;
}

const getVideoIdFromDB = (songTitle, artistName) => {
  return db.select('video_id AS id')
          .from('songs')
          .where('title', songTitle)
          .andWhere('artist_id', db.select('id').from('artists').where('name', artistName));
};

const getVideoIdFromYoutubeAPI = (songTitle, artistName) => {
  return axios.get(`https://www.googleapis.com/youtube/v3/search?q=${songTitle}%20${artistName}&part=snippet&key=${process.env.YOUTUBE_API_KEY}`);
};

const getVideoIdFromAzureAPI = (songTitle, artistName) => {
  return axios.get(`https://api.cognitive.microsoft.com//bing/v7.0/videos/search?q=${songTitle}%20${artistName}&count=1&mkt=en-us`, {
    headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY }
  });
};

const updateSongVideoIdInDB = (songTitle, artistName, videoId) => {
  db('songs')
  .where('artist_id', db.select('id').from('artists').where('name', artistName))
  .andWhere('title', songTitle)
  .update({video_id: videoId})
  .then(num => console.log(num))
};

router.get('/:search', (req, res) => {
  getVideoIdFromDB(req.query.song, req.query.artist).then(id => {
    let videoIdObj = JSON.parse(JSON.stringify(id));
    if(videoIdObj[0].id) {
      console.log('got video from db');
      res.json(videoIdObj[0]);
    }
    else {
      getVideoIdFromYoutubeAPI(req.query.song, req.query.artist).then(songData => {
        if (songData.data.items.length) {
          let id = songData.data.items[0].id.videoId;
          updateSongVideoIdInDB(req.query.song, req.query.artist, id);
          console.log('got video from youtube api');
          res.json({id: id});
        }
      }).catch(err => {
        getVideoIdFromAzureAPI(req.query.song, req.query.artist).then(res => {
          if (res.data.value[0].hasOwnProperty('contentUrl')) {
            res.json({id: res.data.value[0].contentUrl.split('?v=')[1]});
          }
          else {
            getVideoIdFromWeb(req.query.song, req.query.artist).then(id => {
              updateSongVideoIdInDB(req.query.song, req.query.artist, id);
              console.log('got video from web')
              res.json({id: id});
            });
          }
        }).catch(err => {
          getVideoIdFromWeb(req.query.song, req.query.artist).then(id => {
            updateSongVideoIdInDB(req.query.song, req.query.artist, id);
            console.log('got video from web')
            res.json({id: id});
          });
        })
      })
    }
  }).catch(err => console.log(err))
});

module.exports = router;
