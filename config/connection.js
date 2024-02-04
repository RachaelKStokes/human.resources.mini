const mysql = require('mysql2');

//connection object
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'employees'
});

module.exports = connection;