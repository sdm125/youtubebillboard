const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('dist'))
app.use('/api/topten/', require('./src/routes/api/topten'));
app.use('/api/video/', require('./src/routes/api/video'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Youtube Billboard listening on port 3000.'));
