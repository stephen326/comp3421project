const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // 导入连接池

router.post('/', async (req, res) => {
    const { title, description, questions } = req.body;

    console.log('请求体:', JSON.stringify(req.body, null, 2));

    if (!title || !description || !questions || questions.length === 0) {
        return res.status(400).json({ error: '标题、描述或问题不能为空，且至少需要一个问题！' });
    }

    for (const question of questions) {
        if (!question.title || !question.options || question.options.length === 0) {
            return res.status(400).json({ error: '每个问题必须有标题和至少一个选项！' });
        }

        if (question.options.some(option => !option)) {
            return res.status(400).json({ error: '选项内容不能为空！' });
        }
    }

    console.log('验证通过，开始插入数据...');

    let connection;
    try {
        // 从连接池中获取连接
        console.log('尝试从连接池获取连接...');
        connection = await pool.getConnection();
        console.log('成功从连接池获取连接！');

        // 开始事务
        await connection.beginTransaction();

        // 插入投票的标题和描述到 polls 表
        const [pollResult] = await connection.query(
            'INSERT INTO polls (title, description) VALUES (?, ?)',
            [title, description]
        );
        const pollId = pollResult.insertId;
        console.log('插入的投票 ID:', pollId);

        // 全局变量，用于生成 question_id 和 option_id
        let globalQuestionId = 1;

        // 插入每个问题到 question 表，并插入选项到 poll_options 表
        for (const question of questions) {
            const { title: questionTitle, options } = question;

            // 生成 question_id
            const questionId = globalQuestionId++;
            console.log(`正在插入问题: ${questionTitle}，生成的 question_id: ${questionId}`);

            // 插入问题到 question 表
            await connection.query(
                'INSERT INTO question (question_id, question_text) VALUES (?, ?)',
                [questionId, questionTitle]
            );

            // 插入选项到 poll_options 表
            let optionId = 1; // 每个问题的选项从 1 开始
            for (const optionText of options) {
                console.log(`插入选项: ${optionText}，关联的 question_id: ${questionId}, option_id: ${optionId}`);
                await connection.query(
                    'INSERT INTO poll_options (poll_id, question_id, option_id, option_text) VALUES (?, ?, ?, ?)',
                    [pollId, questionId, optionId++, optionText]
                );
            }
        }

        // 提交事务
        await connection.commit();
        console.log('事务提交成功！');

        res.status(201).json({ message: '投票创建成功！' });
    } catch (error) {
        console.error('插入数据时出错:', error);

        if (connection) {
            console.log('回滚事务...');
            await connection.rollback();
            console.log('事务已回滚！');
        }

        res.status(500).json({ error: '服务器内部错误', details: error.message });
    } finally {
        if (connection) {
            console.log('释放连接...');
            connection.release();
            console.log('连接已释放！');
        }
    }
});

module.exports = router;