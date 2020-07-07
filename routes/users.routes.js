const express = require('express');
const connection = require('../conf');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('user')
});

// En tant qu'utilisateur, je veux créer mon profil
router.post('/', (req, res) => {
  const { first_name, last_name, email, password } = req.body
  if(!first_name || !last_name || !email || !password) {
    res.status(422).json({ errorMessage: 'One of field(first_name, last_name, email, password) is missing'})
  } else {
    connection.query('INSERT INTO user SET ?', [req.body], (err, result) => {
      if (err) {
        res.status(500).json({errorMessage: err})
      } else {
        connection.query('SELECT * FROM user where id=?', result.insertId, (errDisplay, resultDisplay) => {
          if (errDisplay) {
            res.status(500).json({errorMessage: errDisplay});
          } else {
            res.status(200).json(resultDisplay);
          }
        })
      }
    })
  }
})


//en tant qu'utilisateur, je veux ajouter une playlist (y compris d'autres utilisateurs) à mes favoris
router.post('/:id/playlists/:playlistId', (req, res) => {
  playlist_user = {
    user_id: req.params.id,
    playlist_id: req.params.playlistId,
  }

  connection.query('INSERT INTO user_playlist SET ?', [playlist_user], (err, results) => {
    if(err){
      res.status(500).json({errorMessage: err})
    } else {
      connection.query('SELECT * FROM user_playlist WHERE id=?', results.insertId, (errDisplay, resultsDisplay) => {
        if(err){
          res.status(500).json({errorMessage: err})
        } else {
          res.status(201).json(resultsDisplay)
        }
      })
    }
  })
});

//en tant qu'utilisateur, je veux enlever une playlist de mes favoris
router.delete('/:id/playlists/:playlistId', (req, res) => {
  const {id, playlistId} = req.params
  connection.query('DELETE FROM user_playlist WHERE user_id=? AND playlist_id=?', [id, playlistId], (err, results)=> {
    if(err){
      res.status(500).json({errorMessage: err})
    } else if(results.affectedRows === 0){
      res.send(422).json({errorMessage: "User or playlist doesn't exists"})
    } else {
      res.sendStatus(204)
    }
  })
});

module.exports = router;
