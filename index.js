const express = require('express');
const app = express();
const port = process.env.PORT || 8080
const playlistRouter = require('./routes/playlist.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/playlists', playlistRouter)

app.listen(port, (err) => {
  if(err) {
    throw new Error('Something bad happened');
  }
  console.log(`Server is listening on port ${port}`)
})
