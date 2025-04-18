const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // 替换为你的 MySQL 密码
    database: 'comp3421', // 指定数据库名
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

// 创建数据库、表和插入数据（如果不存在）
async function initializeDatabase() {
    try {
        // 检查数据库是否存在
        const [rows] = await pool.execute('SHOW DATABASES LIKE "comp3421"');
        console.log('SHOW DATABASES 返回值:', rows);
        if (rows.length === 0) {
            await pool.execute('CREATE DATABASE comp3421');
            console.log('数据库创建成功: comp3421');
        }

        // 使用数据库
        await pool.execute('USE comp3421');

        // 创建投票表 (polls)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS polls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);
        console.log('表创建成功或已存在: polls');

        // 创建投票选项表 (poll_options)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS poll_options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poll_id INT,
                option_text VARCHAR(255) NOT NULL,
                vote_count INT DEFAULT 0,
                FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
            );
        `);
        console.log('表创建成功或已存在: poll_options');
    } catch (err) {
        console.error('初始化数据库时出错:', err);
    }
}

// 调用初始化函数
initializeDatabase();

// 导出数据库连接池
module.exports = pool.promise();