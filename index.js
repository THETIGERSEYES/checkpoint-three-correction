const express = require('express');
const app = express();
const port = process.env.PORT || 8080
const playlistRouter = require('./routes/playlists.routes');
const trackRouter = require('./routes/tracks.routes');
const userRouter = require('./routes/users.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/playlists', playlistRouter)
app.use('/tracks', trackRouter)
app.use('/users', userRouter)

app.listen(port, (err) => {
  if(err) {
    throw new Error('Something bad happened');
  }
  console.log(`Server is listening on port ${port}`)
})
