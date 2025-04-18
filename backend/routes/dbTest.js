const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// 数据库连接配置
const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
};

// 添加根路径处理程序
router.get('/', (req, res) => {
    res.status(200).json({ message: 'dbTest 路由正常工作！' });
});

// 测试数据库连接
router.get('/test-connection', async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        await connection.ping(); // 测试连接是否正常
        await connection.end();
        res.status(200).json({ message: '数据库连接正常！' });
    } catch (error) {
        console.error('数据库连接失败:', error);
        res.status(500).json({ error: '数据库连接失败', details: error.message });
    }
});


router.get('/create-polls-table', async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS polls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);
        await connection.end();
        res.status(200).json({ message: '投票表创建成功或已存在！' });
    } catch (error) {
        console.error('创建投票表失败:', error);
        res.status(500).json({ error: '创建投票表失败', details: error.message });
    }
});



// 查询所有投票
router.get('/polls', async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        const [rows] = await connection.query('SELECT * FROM polls');
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('查询投票数据失败:', error);
        res.status(500).json({ error: '查询投票数据失败', details: error.message });
    }
});

module.exports = router;