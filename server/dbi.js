const mysql = require('mysql');

var pool = mysql.createPool({
  host: "localhost",
  user: "sarisky",
  password: "gottagetapwd",
  database: 'napkin_db'
});

module.exports = {pool};
