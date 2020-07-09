const express = require('express');
const connection = require('../conf');
const router = express.Router();

// Correction de toute la partie 1 ici

router.get('/', (req, res) => {
  connection.query('SELECT * FROM playlist', (err, result) => {
    if (err) throw err;
    else {
      res.status(200).json(result)
    }
  })
});

// En tant qu'utilisateur, je veux pouvoir créer une nouvelle playlist.
router.post('/', (req, res) => {
  const { title, genre } = req.body

  if(!title){
    res.status(422).json({errorMessage: 'title is missing'})
  } else if(!genre){
    res.status(422).json({errorMessage: 'genre is missing'})
  } else {
    connection.query('INSERT INTO playlist SET ?', req.body, (err, results) => {
      if(err) {
        res.status(500).json({errorMessage: err})
      } else {
        connection.query('SELECT * FROM playlist WHERE id=?', results.insertId, (errDisplay, resultDisplay) => {
          if (errDisplay) {
            res.status(500).json({errorMessage: errDisplay})
          } else {
            res.status(201).json(resultDisplay)
          }
        })
      }
    })
  }
});


// en tant qu'utilisateur, je veux pouvoir consulter une playlist en renseignant son id dans l'url (juste ses données propres, pas les pistes associées).
router.get('/:id', (req, res) => {
  const idPlaylist = req.params.id
  connection.query('SELECT * FROM playlist WHERE id=?', idPlaylist, (err, results) => {
    if (err){
      res.status(500).json({errorMessage: err})
    } else if (results.length === 0){
      res.status(404).json({errorMessage: `playlist with id ${idPlaylist} not found`})
    } else {
      res.status(200).json(results)
    }
  })
});

// en tant qu'utilisateur, je veux créer et affecter un morceau à une playlist.
// Je pense à bien récupérer ma playlist_id depuis mon req.body pour qu'on puisse ensuite faire la jointure
router.post('/:id/tracks', (req, res) => {
  const idPlaylist = req.params.id
  const { title, artist, album_picture, youtube_url } = req.body
  if(!title || !artist || !album_picture || !youtube_url){
    res.status(422).json({errorMessage: "One of required fields is missing"})
  } else {
    req.body.playlist_id = idPlaylist
    connection.query('INSERT INTO track SET ?', req.body, (err, result) => {
      if (err) {
        res.status(500).json({errorMessage: err})
      } else {
        connection.query('SELECT * FROM track WHERE id=?', result.insertId, (errDisplay, resultDisplay) => {
          if(errDisplay){
            res.status(500).json({errorMessage: err})
          } else {
            res.status(201).json(resultDisplay[0])
          }
        })
      }
    })
  }
});

// en tant qu'utilisateur, je veux lister tous les morceaux d'une playlist.

// 2 possibilités :
// 1/ SELECT * FROM track WHERE playlist_id = ?
// 2/ SELECT p.title, p.genre, t.title FROM playlist p JOIN track t ON t.playlist_id = p.id WHERE p.id = ?
// la 2e possibilité permet d'afficher des champs spécifiques issus des 2 tables

router.get('/:id/tracks', (req, res) => {
  const idPlaylist = req.params.id
  connection.query('SELECT * FROM playlist p JOIN track t ON t.playlist_id = p.id WHERE p.id = ?', idPlaylist, (err, results) => {
    if(err){
      res.status(500).json({errorMessage: err})
    } else if(results.length === 0) {
      res.status(404).json({errorMessage: `playlist with id ${idPlaylist} was not found`})
    } else {
      res.status(200).json(results)
    }
  })
})

// en tant qu'utilisateur, je veux pouvoir supprimer une playlist.
router.delete('/:id', (req, res) => {
  const idPlaylist = req.params.id
  connection.query('DELETE FROM playlist WHERE id=?', idPlaylist, (err, result) => {
    if(err){
      res.status(500).json({errorMessage: err})
    } else {
      res.status(204).end()
      // ou res.sendStatus(204) pour terminer l'exécution sur le status.
    }
  })
});

//en tant qu'utilisateur, je veux pouvoir modifier une playlist.
router.put('/:id', (req, res) => {
  const idPlaylist = req.params.id

  connection.query('UPDATE playlist SET ? WHERE id=?', [req.body, idPlaylist], (err, results) => {
    if(err) {
      res.status(500).json({errorMessage: err})
    }else {
      connection.query('SELECT * FROM playlist WHERE id=?', idPlaylist, (errDisplay, resultDisplay) => {
        if (errDisplay){
          res.status(500).json({errorMessage: err})
        } else {
          res.status(200).json(resultDisplay[0])
        }
      })
    }
  })
});

// En tant qu'utilisateur, je veux supprimer un morceau d'une playlist.
// Version longue avec vérification de l'existence de la playlist et de la track avant de delete
router.delete('/:id/tracks/:id_track', (req, res) => {
  const idPlaylist = req.params.id
  const idTrack = req.params.id_track

  connection.query('SELECT * FROM playlist WHERE id=?', idPlaylist, (err, results) => {
    if(err){
      res.status(500).json({errorMessage: err})
    } else if(results.length === 0) {
      res.status(404).json({errorMessage: `playlist with id ${idPlaylist} was not found`})
    } else {
    connection.query('SELECT * FROM track WHERE id=?', idTrack, (errTrack, resultTrack) => {
      if(errTrack){
        res.status(500).json({errorMessage: errTrack})
      } else if(resultTrack.length === 0) {
        res.status(404).json({errorMessage: `track with id ${idTrack} was not found`})
      } else {
        connection.query('DELETE FROM track WHERE id= ? ', idTrack, (err, results) => {
          if(err){
            res.status(500).json({errorMessage: err})
          } else if(results.length === 0) {
            res.status(404).json({errorMessage: `track with id ${idTrack} was not found`})
          } else {
            res.sendStatus(204);
          }
        })
      }})
    }
  })
})


// en tant qu'utilisateur, je veux modifier un morceau d'une playlist.
router.put('/:id/tracks/:id_track', (req, res) => {
  const idTrack = req.params.id_track

  connection.query('UPDATE track SET ? WHERE id=?', [req.body, idTrack], (err, result) => {
    if (err) {
      res.status(500).json({errorMessage: err})
    } else {
      connection.query('SELECT * FROM track WHERE id=?', idTrack, (errDisplay, resultDisplay) => {
        if(errDisplay){
          res.status(500).json({errorMessage: err})
        } else {
          res.status(200).json(resultDisplay[0])
        }
      })
    }
  })
});


module.exports = router;
