var mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'019188',
    database:'muli'
  });
  db.connect();
  module.exports = db;