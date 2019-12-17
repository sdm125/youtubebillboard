const express = require('express');
const router = express.Router();
const billboard = require('billboard-top-100').getChart;
const moment = require('moment');
const db = require('../../database');

const errMsg = {
  'chart': {'error': 'chart not found'},
  'date': {'error': 'invalid date'}
};

const doesChartExist = (date) => {
  return db.select('id').from('charts')
          .where('start_date', db.raw('date_sub(?, interval dayofweek(?) - 1  day)', [date, date]))
          .limit(1);
};

const getTopTen = (date, page) => {
  return new Promise((resolve, reject) => {
    doesChartExist(date).then(data => {
      if (data.length) {
        db.select('s.title', 'a.name as artist', 'c.rank')
        .from('charts AS c')
        .leftJoin('songs AS s', 's.id', 'c.song_id')
        .leftJoin('artists AS a', 'a.id', 'c.artist_id')
        .where('c.start_date', db.raw('date_sub(?, interval dayofweek(?) - 1  day)', [date, date]))
        .andWhere('c.end_date', db.raw('date_add(?, interval 7 - dayofweek(?) day)', [date, date]))
        .orderBy('c.rank')
        .limit(10).offset(((page * 10) - 10))
        .then(rows => {
          console.log('got from db')
          resolve(JSON.stringify(rows))
        })
        .catch(err => console.log(err))
      }
      else {
        billboard('hot-100', date, (err, data) => {
          if (err) return reject(err)
          console.log('Getting billboard data...');
          resolve(data.songs.slice(0, 10));
          storeSongsInDB(data.songs, date);
        });
      }
    });
  });
};

const storeSongsInDB = (songs, date) => {
  let inserts = songs.reduce((inserts, song) => {
    inserts.songs.push({
      title: song.title, 
      artist_id: db.raw('(select id from artists where name = ? limit 1)', [song.artist])
    });

    inserts.artists.push({
      name: song.artist
    });

    inserts.chart.push({
      song_id: db.raw(`( select s.id 
                         from songs as s 
                         left join artists as a on s.artist_id = a.id
                         where s.title = ? and a.name = ? )`, 
                       [song.title, song.artist]),
      artist_id: db.raw('(select id from artists where name = ? limit 1)', [song.artist]),
      rank: song.rank,
      start_date: db.raw('date_sub(?, interval dayofweek(?) - 1  day)', [date, date]),
      end_date: db.raw('date_add(?, interval 7 - dayofweek(?) day)', [date, date])
    });

    return inserts;
  }, {artists: [], songs: [], chart: []});

  db.raw(db('artists').insert(inserts.artists).toString().replace('insert', 'INSERT IGNORE')).then(() => {
    db.raw(db('songs').insert(inserts.songs).toString().replace('insert', 'INSERT IGNORE')).then(() => {
      db.raw(db('charts').insert(inserts.chart).toString().replace('insert', 'INSERT IGNORE')).then(num => {
        console.log(num)
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
};

router.get('/date', (req, res) => {
  let month = req.query.month < 10 ? `0${req.query.month}` : req.query.month;
  let day = req.query.day < 10 ? `0${req.query.day}` : req.query.day;
  let page = req.query.page;
  let year = req.query.year;
  let date = `${year}-${month}-${day}`;

  // Validate date
  if (moment(date).isValid() && moment(moment(new Date()).diff(date, 'days')) >= 0) {
    getTopTen(date, page).then((topTen) => {
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

router.get('/random', (req, res) => {
  db.raw(
    `select *
      from (
        select distinct a.name, s.title, s.video_id, c.rank, c.end_date
        from songs as s
        left join artists as a on s.artist_id = a.id
        left join charts as c on c.artist_id = a.id
        where s.video_id is not null
        ) as videos
      order by rand()
      limit 3;`
  ).then(rows => {
      res.send(JSON.stringify(rows[0]))
  });
});

module.exports = router;
