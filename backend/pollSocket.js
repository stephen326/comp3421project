const pool = require('./db/db');

module.exports = (io, socket) => {
    socket.on('joinPollRoom', async (pollId) => {
        try {
            // Join new room
            socket.leaveAll(); // Leave all previous rooms
            socket.join(`poll-${pollId}`);
            console.log(`[joinPollRoom] 用户已加入房间: poll-${pollId}`);
        } catch (err) {
            console.error('[joinPollRoom] 出错:', err);
        }
    });

    socket.on('vote', async ({ pollId, answers }) => {
        console.log(`[vote] 用户投票，pollId: ${pollId}, answers: ${JSON.stringify(answers)}`);
        try {
            // 构建批量更新的 SQL 查询
            const updatePromises = answers.map(({ questionId, optionId }) =>
                pool.query(
                    `UPDATE poll_options SET vote_count = vote_count + 1 WHERE option_id = ? AND question_id = ? AND poll_id = ?`,
                    [optionId, questionId, pollId]
                )
            );
            await Promise.all(updatePromises);

            // 查询所有更新后的选项
            const updatedOptionsQuery = `
                SELECT question_id, option_id, vote_count
                FROM poll_options
                WHERE poll_id = ?
            `;
            const queryParams = [pollId];
            const [updatedOptions] = await pool.query(updatedOptionsQuery, queryParams);

          // turn into 2d array, using defending programming (?)
          const arrayData = Object.values(Object.groupBy(updatedOptions, (opt) => opt.question_id)).map((opts) => opts.sort((a, b) => a.option_id - b.option_id).map((opt) => opt.vote_count));

            // 广播更新后的选项，并加入 pollId
            io.to(`poll-${pollId}`).emit('updateVotes', { pollId, arrayData });
            console.log(`[vote] 广播更新后的投票选项:`, { pollId, updatedOptions });
        } catch (err) {
            console.error('[vote] 出错:', err);
            socket.emit('voteError', { message: '投票失败，请稍后重试。' });
        }
    });
};

// vote 事件的 payload 结构：
// {
//     "pollId": 1,
//     "answers": [
//       { "questionId": "q1", "optionId": "1" },
//       { "questionId": "q2", "optionId": "5" }
//     ]
//   }

// 每次vote后 广播的数据结构：
// {
//     "pollId": 1,
//     "updatedOptions": [
//       { "question_id": "q1", "option_id": "1", "vote_count": 10 },
//       { "question_id": "q2", "option_id": "5", "vote_count": 5 }
//     ]
//   }
