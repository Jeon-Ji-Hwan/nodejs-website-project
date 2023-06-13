var mysql = require('mysql');
var db = mysql.createConnection({
    host     : '127.0.0.1',
    user     : '', //database 사용자명
    password : '', //database 비밀번호
    database : 'opentutorials',

});
db.connect();
module.exports = db;