require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

connection.connect(function(err) {
  if(err) {
    console.log(`error connecting: ${err.stack}`);
  } else {
    console.log(`connected as id ${connection.threadId}`)
  }
});

module.exports = connection;
