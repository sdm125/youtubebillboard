const express = require('express');
const app = express();
const path = require('path');
const billboard = require('billboard-top-100').getChart;
const moment = require('moment');

const errMsg = {'chart':{'error':'chart not found'}, 'date': {'error': 'invalid date'}};

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
        position: [Object] },
      { rank: 11,
        title: 'If I Can\'t Have You',
        artist: 'Shawn Mendes',
        cover:
         'https://charts-static.billboard.com/img/2019/05/shawn-mendes-drf-87x87.jpg',
        position: [Object] },
      { rank: 12,
        title: 'Sucker',
        artist: 'Jonas Brothers',
        cover:
         'https://charts-static.billboard.com/img/2019/03/jonas-brothers-m8u-174x174.jpg',
        position: [Object] },
      { rank: 13,
        title: 'Money In The Grave',
        artist: 'Drake Featuring Rick Ross',
        cover:
         'https://charts-static.billboard.com/img/2019/06/drake-zwl-money-in-the-grave-7rt-174x174.jpg',
        position: [Object] },
      { rank: 14,
        title: 'Sunflower (Spider-Man: Into The Spider-Verse)',
        artist: 'Post Malone & Swae Lee',
        cover:
         'https://charts-static.billboard.com/img/2018/10/post-malone-tp6-174x174.jpg',
        position: [Object] },
      { rank: 15,
        title: 'Suge',
        artist: 'DaBaby',
        cover:
         'https://charts-static.billboard.com/img/2019/03/dababy-yo9-174x174.jpg',
        position: [Object] },
      { rank: 16,
        title: 'The Git Up',
        artist: 'Blanco Brown',
        cover:
         'https://charts-static.billboard.com/img/2019/06/blanco-brown-126-the-git-up-01x-174x174.jpg',
        position: [Object] },
      { rank: 17,
        title: 'Someone You Loved',
        artist: 'Lewis Capaldi',
        cover:
         'https://charts-static.billboard.com/img/2019/03/lewis-capaldi-s2h-someone-you-loved-esv-174x174.jpg',
        position: [Object] },
      { rank: 18,
        title: 'You Need To Calm Down',
        artist: 'Taylor Swift',
        cover:
         'https://charts-static.billboard.com/img/2019/06/taylor-swift-p7u-you-need-to-calm-down-m7h-174x174.jpg',
        position: [Object] },
      { rank: 19,
        title: 'Hey Look Ma, I Made It',
        artist: 'Panic! At The Disco',
        cover:
         'https://charts-static.billboard.com/img/2018/07/panic-at-the-disco-yl6-87x87.jpg',
        position: [Object] },
      { rank: 20,
        title: 'Dancing With A Stranger',
        artist: 'Sam Smith & Normani',
        cover:
         'https://charts-static.billboard.com/img/2019/01/sam-smith-9q2-87x87.jpg',
        position: [Object] },
      { rank: 21,
        title: 'Beer Never Broke My Heart',
        artist: 'Luke Combs',
        cover:
         'https://charts-static.billboard.com/img/2019/05/luke-combs-y14-beer-never-broke-my-heart-ja2-174x174.jpg',
        position: [Object] },
      { rank: 22,
        title: 'Beautiful People',
        artist: 'Ed Sheeran Featuring Khalid',
        cover:
         'https://charts-static.billboard.com/img/2019/07/ed-sheeran-featuring-khalid-000-beautiful-people-qgs-174x174.jpg',
        position: [Object] },
      { rank: 23,
        title: 'Wow.',
        artist: 'Post Malone',
        cover:
         'https://charts-static.billboard.com/img/2019/01/post-malone-tp6-174x174.jpg',
        position: [Object] },
      { rank: 24,
        title: 'Without Me',
        artist: 'Halsey',
        cover:
         'https://charts-static.billboard.com/img/2018/10/halsey-7xl-87x87.jpg',
        position: [Object] },
      { rank: 25,
        title: 'Pop Out',
        artist: 'Polo G Featuring Lil Tjay',
        cover:
         'https://charts-static.billboard.com/img/2019/03/polo-g-g7p-pop-out-gz4-174x174.jpg',
        position: [Object] },
      { rank: 26,
        title: 'Happier',
        artist: 'Marshmello & Bastille',
        cover:
         'https://charts-static.billboard.com/img/2018/08/marshmello-9ph-174x174.jpg',
        position: [Object] },
      { rank: 27,
        title: 'The London',
        artist: 'Young Thug, J. Cole & Travis Scott',
        cover:
         'https://charts-static.billboard.com/img/2019/06/young-thug-288-the-london-86p-174x174.jpg',
        position: [Object] },
      { rank: 28,
        title: 'Speechless',
        artist: 'Dan + Shay',
        cover:
         'https://charts-static.billboard.com/img/2018/06/dan-shay-53q-speechless-2ps-174x174.jpg',
        position: [Object] },
      { rank: 29,
        title: 'God\'s Country',
        artist: 'Blake Shelton',
        cover:
         'https://charts-static.billboard.com/img/2019/04/blake-shelton-22w-gods-country-dg3-174x174.jpg',
        position: [Object] },
      { rank: 30,
        title: '7 Rings',
        artist: 'Ariana Grande',
        cover:
         'https://charts-static.billboard.com/img/2019/01/ariana-grande-ypy-174x174.jpg',
        position: [Object] },
      { rank: 31,
        title: 'Panini',
        artist: 'Lil Nas X',
        cover:
         'https://charts-static.billboard.com/img/2019/07/lil-nas-x-8wa-174x174.jpg',
        position: [Object] },
      { rank: 32,
        title: 'Knockin\' Boots',
        artist: 'Luke Bryan',
        cover:
         'https://charts-static.billboard.com/img/2019/04/luke-bryan-kl4-knockin-boots-626-174x174.jpg',
        position: [Object] },
      { rank: 33,
        title: 'All To Myself',
        artist: 'Dan + Shay',
        cover:
         'https://charts-static.billboard.com/img/2018/05/dan-shay-53q-all-to-myself-wdv-174x174.jpg',
        position: [Object] },
      { rank: 34,
        title: 'Sweet But Psycho',
        artist: 'Ava Max',
        cover:
         'https://charts-static.billboard.com/img/2018/11/ava-max-k5u-sweet-but-psycho-yjd-174x174.jpg',
        position: [Object] },
      { rank: 35,
        title: 'My Type',
        artist: 'Saweetie',
        cover:
         'https://charts-static.billboard.com/img/2019/06/saweetie-g0q-my-type-f1n-174x174.jpg',
        position: [Object] },
      { rank: 36,
        title: 'Whiskey Glasses',
        artist: 'Morgan Wallen',
        cover:
         'https://charts-static.billboard.com/img/2018/09/morgan-wallen-ur7-174x174.jpg',
        position: [Object] },
      { rank: 37,
        title: 'How Do You Sleep?',
        artist: 'Sam Smith',
        cover:
         'https://charts-static.billboard.com/img/2019/07/sam-smith-9q2-how-do-you-sleep-fjj-174x174.jpg',
        position: [Object] },
      { rank: 38,
        title: 'Never Really Over',
        artist: 'Katy Perry',
        cover:
         'https://charts-static.billboard.com/img/2019/06/katy-perry-l8p-never-really-over-r91-174x174.jpg',
        position: [Object] },
      { rank: 39,
        title: 'Shotta Flow',
        artist: 'NLE Choppa',
        cover:
         'https://charts-static.billboard.com/img/2019/03/nle-choppa-7eu-174x174.jpg',
        position: [Object] },
      { rank: 40,
        title: 'Rearview Town',
        artist: 'Jason Aldean',
        cover:
         'https://charts-static.billboard.com/img/2018/03/jason-aldean-jfn-rearview-town-ryu-174x174.jpg',
        position: [Object] },
      { rank: 41,
        title: 'Cash Shit',
        artist: 'Megan Thee Stallion Featuring DaBaby',
        cover:
         'https://charts-static.billboard.com/img/2019/06/megan-thee-stallion-fnn-cash-shit-gdm-174x174.jpg',
        position: [Object] },
      { rank: 42,
        title: 'Better',
        artist: 'Khalid',
        cover:
         'https://charts-static.billboard.com/img/2018/09/khalid-dsk-87x87.jpg',
        position: [Object] },
      { rank: 43,
        title: 'China',
        artist: 'Anuel AA, Daddy Yankee, Karol G, Ozuna & J Balvin',
        cover:
         'https://charts-static.billboard.com/img/2019/07/anuel-aa-uwq-china-oz2-174x174.jpg',
        position: [Object] },
      { rank: 44,
        title: 'Otro Trago',
        artist: 'Sech, Darell, Nicky Jam, Ozuna & Anuel AA',
        cover:
         'https://charts-static.billboard.com/img/2019/05/sech-23y-174x174.jpg',
        position: [Object] },
      { rank: 45,
        title: 'Baby',
        artist: 'Lil Baby & DaBaby',
        cover:
         'https://charts-static.billboard.com/img/2019/08/lil-baby-nwx-baby-qpa-174x174.jpg',
        position: [Object] },
      { rank: 46,
        title: 'The Ones That Didn\'t Make It Back Home',
        artist: 'Justin Moore',
        cover:
         'https://charts-static.billboard.com/img/2018/11/justin-moore-mtw-the-ones-that-didnt-make-it-back-home-wsx-174x174.jpg',
        position: [Object] },
      { rank: 47,
        title: 'Going Bad',
        artist: 'Meek Mill Featuring Drake',
        cover:
         'https://charts-static.billboard.com/img/2018/12/meek-mill-utw-174x174.jpg',
        position: [Object] },
      { rank: 48,
        title: 'Worth It',
        artist: 'YK Osiris',
        cover:
         'https://charts-static.billboard.com/img/2019/02/yk-osiris-xz3-174x174.jpg',
        position: [Object] },
      { rank: 49,
        title: 'Shallow',
        artist: 'Lady Gaga & Bradley Cooper',
        cover:
         'https://charts-static.billboard.com/img/2018/10/lady-gaga-gyl-87x87.jpg',
        position: [Object] },
      { rank: 50,
        title: 'Clout',
        artist: 'Offset Featuring Cardi B',
        cover:
         'https://charts-static.billboard.com/img/2019/03/offset-cdz-174x174.jpg',
        position: [Object] },
      { rank: 51,
        title: 'Go Loko',
        artist: 'YG, Tyga & Jon Z',
        cover:
         'https://charts-static.billboard.com/img/2019/05/yg-fg4-174x174.jpg',
        position: [Object] },
      { rank: 52,
        title: 'Trampoline',
        artist: 'SHAED',
        cover:
         'https://charts-static.billboard.com/img/2018/12/shaed-ffm-174x174.jpg',
        position: [Object] },
      { rank: 53,
        title: 'Callaita',
        artist: 'Bad Bunny & Tainy',
        cover:
         'https://charts-static.billboard.com/img/2019/06/bad-bunny-157-callaita-810-174x174.jpg',
        position: [Object] },
      { rank: 54,
        title: 'Raised On Country',
        artist: 'Chris Young',
        cover:
         'https://charts-static.billboard.com/img/2019/01/chris-young-obk-raised-on-country-86y-174x174.jpg',
        position: [Object] },
      { rank: 55,
        title: 'Easier',
        artist: '5 Seconds Of Summer',
        cover:
         'https://charts-static.billboard.com/img/2019/06/5-seconds-of-summer-deq-87x87.jpg',
        position: [Object] },
      { rank: 56,
        title: 'Call You Mine',
        artist: 'The Chainsmokers & Bebe Rexha',
        cover:
         'https://charts-static.billboard.com/img/2019/06/the-chainsmokers-39n-call-you-mine-3tt-174x174.jpg',
        position: [Object] },
      { rank: 57,
        title: 'Talk You Out Of It',
        artist: 'Florida Georgia Line',
        cover:
         'https://charts-static.billboard.com/img/2018/07/florida-georgia-line-wbf-talk-you-out-of-it-u03-174x174.jpg',
        position: [Object] },
      { rank: 58,
        title: 'Trust Issues',
        artist: 'Drake',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 59,
        title: 'Just Us',
        artist: 'DJ Khaled Featuring SZA',
        cover:
         'https://charts-static.billboard.com/img/2019/05/dj-khaled-igg-174x174.jpg',
        position: [Object] },
      { rank: 60,
        title: 'How About Now',
        artist: 'Drake',
        cover:
         'https://charts-static.billboard.com/img/2014/11/drake-zwl-174x174.jpg',
        position: [Object] },
      { rank: 61,
        title: 'The Motion',
        artist: 'Drake',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 62,
        title: 'One Thing Right',
        artist: 'Marshmello & Kane Brown',
        cover:
         'https://charts-static.billboard.com/img/2019/07/marshmello-9ph-one-thing-right-e6g-174x174.jpg',
        position: [Object] },
      { rank: 63,
        title: 'Only Human',
        artist: 'Jonas Brothers',
        cover:
         'https://charts-static.billboard.com/img/2019/06/jonas-brothers-m8u-174x174.jpg',
        position: [Object] },
      { rank: 64,
        title: 'Press',
        artist: 'Cardi B',
        cover:
         'https://charts-static.billboard.com/img/2019/06/cardi-b-n38-174x174.jpg',
        position: [Object] },
      { rank: 65,
        title: 'Some Of It',
        artist: 'Eric Church',
        cover:
         'https://charts-static.billboard.com/img/2019/01/eric-church-3cj-174x174.jpg',
        position: [Object] },
      { rank: 66,
        title: 'ME!',
        artist: 'Taylor Swift Featuring Brendon Urie',
        cover:
         'https://charts-static.billboard.com/img/2019/05/taylor-swift-p7u-me-ffx-174x174.jpg',
        position: [Object] },
      { rank: 67,
        title: 'Queen Of Mean',
        artist: 'Sarah Jeffery',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 68,
        title: 'Dreams Money Can Buy',
        artist: 'Drake',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 69,
        title: 'I Don\'t Know About You',
        artist: 'Chris Lane',
        cover:
         'https://charts-static.billboard.com/img/2018/07/chris-lane-pi2-174x174.jpg',
        position: [Object] },
      { rank: 70,
        title: 'Soltera',
        artist: 'Lunay, Daddy Yankee & Bad Bunny',
        cover:
         'https://charts-static.billboard.com/img/2019/03/lunay-000-soltera-tn4-174x174.jpg',
        position: [Object] },
      { rank: 71,
        title: 'Lalala',
        artist: 'Y2K & bbno$',
        cover:
         'https://charts-static.billboard.com/img/2019/07/y2k-000-lalala-lls-174x174.jpg',
        position: [Object] },
      { rank: 72,
        title: 'Living',
        artist: 'Dierks Bentley',
        cover:
         'https://charts-static.billboard.com/img/2018/05/dierks-bentley-yjg-174x174.jpg',
        position: [Object] },
      { rank: 73,
        title: 'Gold Roses',
        artist: 'Rick Ross Featuring Drake',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 74,
        title: 'Hate Me',
        artist: 'Ellie Goulding & Juice WRLD',
        cover:
         'https://charts-static.billboard.com/img/2019/07/ellie-goulding-1mr-hate-me-wrp-174x174.jpg',
        position: [Object] },
      { rank: 75,
        title: 'It\'s You',
        artist: 'Ali Gatie',
        cover:
         'https://charts-static.billboard.com/img/2019/06/ali-gatie-000-its-you-xyb-174x174.jpg',
        position: [Object] },
      { rank: 76,
        title: 'Southbound',
        artist: 'Carrie Underwood',
        cover:
         'https://charts-static.billboard.com/img/2019/05/carrie-underwood-ko6-southbound-q49-174x174.jpg',
        position: [Object] },
      { rank: 77,
        title: 'Earfquake',
        artist: 'Tyler, The Creator',
        cover:
         'https://charts-static.billboard.com/img/2019/06/tyler-the-creator-556-174x174.jpg',
        position: [Object] },
      { rank: 78,
        title: 'No Me Conoce',
        artist: 'Jhay Cortez, J Balvin & Bad Bunny',
        cover:
         'https://charts-static.billboard.com/img/2019/06/jhay-cortez-k8z-174x174.jpg',
        position: [Object] },
      { rank: 79,
        title: 'Time',
        artist: 'NF',
        cover:
         'https://charts-static.billboard.com/img/2019/07/nf-rht-time-pru-174x174.jpg',
        position: [Object] },
      { rank: 80,
        title: 'Hot Shower',
        artist: 'Chance The Rapper Featuring MadeinTYO & DaBaby',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 81,
        title: 'Right Back',
        artist: 'Khalid',
        cover:
         'https://charts-static.billboard.com/img/2019/04/khalid-dsk-87x87.jpg',
        position: [Object] },
      { rank: 82,
        title: 'Uno',
        artist: 'Ambjaay',
        cover:
         'https://charts-static.billboard.com/img/2019/06/ambjaay-000-uno-zeb-174x174.jpg',
        position: [Object] },
      { rank: 83,
        title: '24/7',
        artist: 'Meek Mill Featuring Ella Mai',
        cover:
         'https://charts-static.billboard.com/img/2018/12/meek-mill-utw-174x174.jpg',
        position: [Object] },
      { rank: 84,
        title: 'Single Again',
        artist: 'Big Sean',
        cover:
         'https://charts-static.billboard.com/img/2019/08/big-sean-820-single-again-jdy-174x174.jpg',
        position: [Object] },
      { rank: 85,
        title: 'Club Paradise',
        artist: 'Drake',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 86,
        title: 'Tip Of My Tongue',
        artist: 'Kenny Chesney',
        cover:
         'https://charts-static.billboard.com/img/2019/07/kenny-chesney-en6-tip-of-my-tongue-1qs-174x174.jpg',
        position: [Object] },
      { rank: 87,
        title: 'Love Ain\'t',
        artist: 'Eli Young Band',
        cover:
         'https://charts-static.billboard.com/img/2018/06/eli-young-band-8g9-87x87.jpg',
        position: [Object] },
      { rank: 88,
        title: 'Antisocial',
        artist: 'Ed Sheeran & Travis Scott',
        cover:
         'https://charts-static.billboard.com/img/2019/07/ed-sheeran-3vg-174x174.jpg',
        position: [Object] },
      { rank: 89,
        title: 'Ballin\'',
        artist: 'Mustard Featuring Roddy Ricch',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 90,
        title: 'We Were',
        artist: 'Keith Urban',
        cover:
         'https://charts-static.billboard.com/img/2019/05/keith-urban-t54-87x87.jpg',
        position: [Object] },
      { rank: 91,
        title: 'La La Land',
        artist: 'Bryce Vine Featuring YG',
        cover:
         'https://charts-static.billboard.com/img/2019/03/bryce-vine-chk-174x174.jpg',
        position: [Object] },
      { rank: 92,
        title: 'Tap',
        artist: 'NAV Featuring Meek Mill',
        cover:
         'https://charts-static.billboard.com/img/2019/04/nav-b0r-87x87.jpg',
        position: [Object] },
      { rank: 93,
        title: 'Fear Inoculum',
        artist: 'Tool',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 94,
        title: 'Love You Too Late',
        artist: 'Cole Swindell',
        cover:
         'https://charts-static.billboard.com/img/2018/07/cole-swindell-lq3-174x174.jpg',
        position: [Object] },
      { rank: 95,
        title: 'Days In The East',
        artist: 'Drake',
        cover:
         'https://assets.billboard.com/assets/1565881383/images/charts/bb-placeholder-new.jpg?f5cede3a841850a742ad',
        position: [Object] },
      { rank: 96,
        title: 'Rodeo',
        artist: 'Lil Nas X & Cardi B',
        cover:
         'https://charts-static.billboard.com/img/2019/07/lil-nas-x-8wa-174x174.jpg',
        position: [Object] },
      { rank: 97,
        title: 'What Happens In A Small Town',
        artist: 'Brantley Gilbert + Lindsay Ell',
        cover:
         'https://charts-static.billboard.com/img/2018/12/brantley-gilbert-iis-what-happens-in-a-small-town-3cd-174x174.jpg',
        position: [Object] },
      { rank: 98,
        title: 'Daddy',
        artist: 'Blueface & Rich The Kid',
        cover:
         'https://charts-static.billboard.com/img/2019/07/blueface-2aw-daddy-gt5-174x174.jpg',
        position: [Object] },
      { rank: 99,
        title: 'Prayed For You',
        artist: 'Matt Stell',
        cover:
         'https://charts-static.billboard.com/img/2019/01/matt-stell-000-prayed-for-you-vbm-174x174.jpg',
        position: [Object] },
      { rank: 100,
        title: 'Before I Let Go',
        artist: 'Beyonce',
        cover:
         'https://charts-static.billboard.com/img/2019/04/beyonce-000-before-i-let-go-homecoming-live-a3t-174x174.jpg',
        position: [Object] } ],
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

app.get('/api/date', (req, res) => {
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

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Youtube Billboard listening on port 3000.'));
