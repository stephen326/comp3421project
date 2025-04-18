const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// 加载 .env 文件中的配置
dotenv.config();

// 创建一个不指定数据库的连接
const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

async function initializeDatabase() {
    let connection;
    try {
        // 连接到 MySQL 服务器（不指定数据库）
        connection = await mysql.createConnection(connectionConfig);
        console.log('成功连接到 MySQL 服务器！');

        // 检查数据库是否存在
        const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_DATABASE}'`);
        if (rows.length === 0) {
            // 如果数据库不存在，则创建数据库
            await connection.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
            console.log(`数据库 ${process.env.DB_DATABASE} 创建成功！`);
        } else {
            console.log(`数据库 ${process.env.DB_DATABASE} 已存在！`);
        }

        // 切换到目标数据库
        await connection.query(`USE ${process.env.DB_DATABASE}`);

        // 删除表（如果存在）
        console.log('检查并删除表（如果存在）...');
        await connection.query(`DROP TABLE IF EXISTS poll_options`);
        console.log('表 poll_options 已删除（如果存在）');
        await connection.query(`DROP TABLE IF EXISTS polls`);
        console.log('表 polls 已删除（如果存在）');
        await connection.query(`DROP TABLE IF EXISTS question`);
        console.log('表 question 已删除（如果存在）');

        // 创建投票表 (polls)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS polls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);
        console.log('表创建成功或已存在: polls');

        // 创建问题表 (question)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS question (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_id VARCHAR(255) NOT NULL UNIQUE,
                question_text VARCHAR(255) NOT NULL
            );
        `);
        console.log('表创建成功或已存在: question');

        // 创建投票选项表 (poll_options)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS poll_options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poll_id INT,
                question_id VARCHAR(255) NOT NULL,
                option_id VARCHAR(255) NOT NULL,
                option_text VARCHAR(255) NOT NULL,
                vote_count INT DEFAULT 0,
                FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
                FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
            );
        `);
        console.log('表创建成功或已存在: poll_options');

        // 创建示例问卷数据，一个问题四个选项
        await connection.query(`
            INSERT INTO polls (title, description) VALUES ('你喜欢哪种水果？', '请选择你最喜欢的水果。')
        `);
        // 选项
        await connection.query(`
            INSERT INTO poll_options (poll_id, option_text) VALUES
            (1, '苹果'),
            (1, '香蕉'),
            (1, '橘子'),
            (1, '葡萄')
        `);
    } catch (err) {
        console.error('初始化数据库时出错:', err);
    } finally {
        if (connection) {
            await connection.end(); // 关闭连接
        }
    }
}

// 导出函数供其他模块调用
module.exports = { initializeDatabase };