const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // 导入连接池

router.get('/:pollId', async (req, res) => {
    const { pollId } = req.params;

    if (!pollId) {
        return res.status(400).json({ error: '投票 ID 不能为空！' });
    }
    if (isNaN(pollId)) {
        return res.status(400).json({ error: '投票 ID 必须是数字！' });
    }


    try {
        // 查询投票的标题和描述
        const [pollResult] = await pool.query(
            'SELECT title, description FROM polls WHERE id = ?',
            [pollId]
        );

        if (pollResult.length === 0) {
            return res.status(404).json({ error: '未找到该投票！', message: '无效的投票 ID，请检查输入。' });
        }

        const poll = pollResult[0];

        // 查询问题和选项
        const [questionsResult] = await pool.query(
            `SELECT 
                q.id AS question_id, 
                q.question_text, 
                o.option_id, 
                o.option_text, 
                o.vote_count
             FROM question q
             LEFT JOIN poll_options o ON q.id = o.q_id AND o.poll_id = ?
             WHERE o.poll_id = ?`,
            [pollId, pollId]
        );

        // 将查询结果转换为所需的格式
        const questions = questionsResult.reduce((acc, row) => {
            const { question_id, question_text, option_id, option_text, vote_count } = row;

            if (!acc[question_id]) {
                acc[question_id] = {
                    questionId: question_id,
                    questionText: question_text,
                    options: {}
                };
            }

            if (option_id !== null) {
                acc[question_id].options[option_id] = {
                    optionId: option_id,
                    optionText: option_text,
                    voteCount: vote_count
                };
            }

            return acc;
        }, {});

        res.json({
            pollId,
            title: poll.title,
            description: poll.description,
            questions: Object.values(questions),
        });
    } catch (error) {
        console.error('查询投票结果时出错:', error);
        res.status(500).json({ error: '服务器错误，请稍后重试。' });
    }
});

module.exports = router;

// 期望返回的数据结构：
// {
//     "pollId": 1,
//     "title": "Favorite Hobbies Survey",
//     "description": "A survey to understand your favorite hobbies.",
//     "questions": [
//         {
//             "questionId": 1,
//             "questionText": "Which outdoor activity do you enjoy most?",
//             "options": {
//                 "1": {
//                     "optionId": 1,
//                     "optionText": "Hiking",
//                     "voteCount": 10
//                 },
//                 "2": {
//                     "optionId": 2,
//                     "optionText": "Cycling",
//                     "voteCount": 5
//                 },
//                 "3": {
//                     "optionId": 3,
//                     "optionText": "Swimming",
//                     "voteCount": 8
//                 }
//             }
//         },
//         {
//             "questionId": 2,
//             "questionText": "Which indoor activity do you prefer?",
//             "options": {
//                 "1": {
//                     "optionId": 1,
//                     "optionText": "Reading",
//                     "voteCount": 12
//                 },
//                 "2": {
//                     "optionId": 2,
//                     "optionText": "Gaming",
//                     "voteCount": 15
//                 },
//                 "3": {
//                     "optionId": 3,
//                     "optionText": "Cooking",
//                     "voteCount": 7
//                 }
//             }
//         }
//     ]
// }