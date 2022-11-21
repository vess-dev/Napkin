const mysql = require('mysql');

var pool = mysql.createPool({
  host: "localhost",
  user: "pmoore",
  password: "password",
  database: 'demoapp'
});

module.exports = {pool};