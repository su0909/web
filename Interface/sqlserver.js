var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nsql'
});

connection.connect();



connection.query('SELECT * FROM user', function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
});


connection.end();