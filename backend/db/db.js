const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST, // Railway 提供的数据库主机
    user: process.env.DB_USER, // 数据库用户名
    password: process.env.DB_PASSWORD, // 数据库密码
    database: process.env.DB_NAME, // 数据库名称
    waitForConnections: true,
    connectionLimit: 10, // 最大连接数
    queueLimit: 0
});

module.exports = pool;