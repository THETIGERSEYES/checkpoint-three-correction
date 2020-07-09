const express = require('express');
const connection = require('../conf');
const router = express.Router();

// correction du bonus ici
router.get('/', (req, res) => {
  const {title, artist} = req.query
  if(title && artist){
    connection.query('SELECT * FROM track WHERE title LIKE ? OR artist=?', [`%${title}%`, `%${artist}%`], (err, results) => {
      if (err){
        res.status(500).json({errorMessage: err})
      } else if (results.length === 0){
        res.status(422).json({errorMessage: "No track or playlist founded"})
      } else {
        res.status(200).json(results)
      }
    })
  } else if(title && !artist){
    connection.query('SELECT * FROM track WHERE title LIKE ?', [`%${title}%`], (err, results) => {
      if (err){
        res.status(500).json({errorMessage: err})
      } else if (results.length === 0){
        res.status(422).json({errorMessage: `track with the artist ${title} not found`})
      } else {
        res.status(200).json(results)
      }
    })
  } else if(artist && !title){
    connection.query('SELECT * FROM track WHERE artist LIKE ?', [`%${artist}%`], (err, results) => {
      if (err){
        res.status(500).json({errorMessage: err})
      } else {
        res.status(200).json(results)
      }
    })
  } else if(!title || !artist){
    connection.query('SELECT * FROM track', (err, results) => {
      if (err){
        res.status(500).json({errorMessage: err})
      } else if (result.length === 0){
        res.status(422).json({errorMessage: "No track founded"})
      } else {
        res.status(200).json(results)
      }
    })
  }
});


module.exports = router;
