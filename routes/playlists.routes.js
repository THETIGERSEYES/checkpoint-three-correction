const express = require('express');
const connection = require('../conf');
const router = express.Router();

router.get('/', (req, res) => {
  let { search } = req.query
  search ? (
    connection.query('SELECT * FROM playlist WHERE title LIKE ? OR genre=?', [`%${search}%`,`${search}`], (err, results) => {
      if(err){
        res.status(422).json({errorMessage: `there is no playlist with the title or genre like ${search}`})
      } else {
        res.status(200).json(results)
      }
    })
  ):(
    connection.query('SELECT * FROM playlist', (err, results) => {
      if(err){
        res.status(500).json({errorMessage: err})
      } else if(results.length === 0){
        res.status(422).json({errorMessage: "No playlist founded"})
      } else {
        res.status(200).json(results)
      }
    })
  )
});

module.exports = router;
