var mysql = require('mysql');
var login = {
  host:'localhost',
  user:'root',
  password:'019188',
  database:'muli'
};
var db = mysql.createConnection(login);
  db.connect();
  module.exports = db;