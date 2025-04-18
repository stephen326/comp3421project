const pool = require('./db/db');

const getPollOptions = async (pollId) => {
  console.log(`[getPollOptions] 获取投票选项，pollId: ${pollId}`);
  const [rows] = await pool.query(
    `SELECT id, option_text, vote_count FROM poll_options WHERE poll_id = ?`,
    [pollId]
  );
  console.log(`[getPollOptions] 查询结果:`, rows);
  return rows;
};

module.exports = (io, socket) => {
  socket.on('joinPoll', async (pollId) => {
    console.log(`[joinPoll] 用户尝试加入投票，pollId: ${pollId}`);
    try {
      socket.join(`poll-${pollId}`);
      console.log(`[joinPoll] 用户已加入房间: poll-${pollId}`);
      const options = await getPollOptions(pollId);
      console.log(`[joinPoll] 发送投票选项给客户端:`, options);
      socket.emit('updateVotes', options);
    } catch (err) {
      console.error('[joinPoll] 出错:', err);
    }
  });

  socket.on('vote', async ({ pollId, optionId }) => {
    console.log(`[vote] 用户投票，pollId: ${pollId}, optionId: ${optionId}`);
    try {
      const updateResult = await pool.query(
        `UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ? AND poll_id = ?`,
        [optionId, pollId]
      );
      console.log(`[vote] 更新投票计数结果:`, updateResult);
      const updatedOptions = await getPollOptions(pollId);
      console.log(`[vote] 广播更新后的投票选项:`, updatedOptions);
      io.to(`poll-${pollId}`).emit('updateVotes', updatedOptions);
    } catch (err) {
      console.error('[vote] 出错:', err);
    }
  });
};