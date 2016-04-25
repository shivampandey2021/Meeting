var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 200,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'meeting_application'
});

exports.mysql_pool = pool;