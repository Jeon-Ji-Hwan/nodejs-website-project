var mysql = require('mysql');
var db = mysql.createConnection({
    host     : '180.69.41.10',
    user     : 'nodejs',
    password : '00wlghks**',
    database : 'opentutorials',
    port     : 3307

});
db.connect();
module.exports = db;