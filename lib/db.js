var mysql = require('mysql');
var db = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'nodejs',
    password : '00wlghks**',
    database : 'opentutorials',

});
db.connect();
module.exports = db;