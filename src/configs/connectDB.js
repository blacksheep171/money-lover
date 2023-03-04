import mysql from 'mysql2/promise';

// create the connection to database

console.log(">>> Creating connection pool!");

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'money_lover'
});

export default connection;