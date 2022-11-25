require('dotenv').config();
const mysql = require('mysql2');
const md5 = require('md5');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});

console.log(pool);
module.exports = { pool };