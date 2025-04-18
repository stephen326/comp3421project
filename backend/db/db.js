const mysql = require('mysql2');
const dotenv = require('dotenv');

// 加载 .env 文件中的配置
dotenv.config();

// 创建数据库连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // 从 .env 文件中读取数据库主机
    user: process.env.DB_USER,       // 从 .env 文件中读取数据库用户名
    password: process.env.DB_PASSWORD, // 从 .env 文件中读取数据库密码
    database: process.env.DB_DATABASE, // 从 .env 文件中读取数据库名称
    port: process.env.DB_PORT,       // 从 .env 文件中读取数据库端口
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试数据库连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error('连接数据库时出错:', err);
    } else {
        console.log('成功连接到 MySQL 服务器！');
        connection.release();
    }
});

// 导出数据库连接池
module.exports = pool.promise();