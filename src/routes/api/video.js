const express = require('express');
const router = express.Router();
require('dotenv').config();
const puppeteer = require('puppeteer');
const selector = 'ytd-search ytd-thumbnail a';

const getId = async (q) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.SEARCH_URL}${encodeURIComponent(q)}`, {waitUntil: 'networkidle0'});
  await page.waitForSelector(selector);
  let id = await page.$eval(selector, el => el.getAttribute('href').split('v=')[1]);
  browser.close();
  return id;
}

// router.get('/:search', (req, res) => {
//   getId(req.query.q).then(id => {
//     res.json({'id': id});
//   });
// });

router.get('/:search', (req, res) => {
  res.json({'id': 'vcJf5LIIZ-0'});
});

module.exports = router;
