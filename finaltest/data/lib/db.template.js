var mysql = require('mysql');
// 버전관리용 샘플파일
var db = mysql.createConnection({
    host:'',
    user:'',
    password:'',
    database:''
  });
  db.connect();
  module.exports = db;