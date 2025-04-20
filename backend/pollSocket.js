const pool = require('./db/db');

module.exports = (io, socket) => {
    socket.on('joinPollRoom', async (pollId) => {
        try {
            // Join new room
            socket.leaveAll(); // Leave all previous rooms
            socket.join(`poll-${pollId}`);
            console.log(`[joinPollRoom] User has joined room: poll-${pollId}`);
        } catch (err) {
            console.error('[joinPollRoom] Error:', err);
        }
    });

    socket.on('vote', async ({ pollId, answers }) => {
        console.log(`[vote] User voted, pollId: ${pollId}, answers: ${JSON.stringify(answers)}`);
        try {
            // Build batch update SQL query
            const updatePromises = Object.entries(answers).map(([ questionId, optionId ]) =>
                pool.query(
                    `UPDATE poll_options SET vote_count = vote_count + 1 WHERE option_id = ? AND question_id = ? AND poll_id = ?`,
                    [optionId, questionId, pollId]
                )
            );
            await Promise.all(updatePromises);

            // Query all updated options
            const updatedOptionsQuery = `
                SELECT question_id, option_id, vote_count
                FROM poll_options
                WHERE poll_id = ?
            `;
            const queryParams = [pollId];
            const [updatedOptions] = await pool.query(updatedOptionsQuery, queryParams);

            // Turn into 2D array, using defensive programming
            const arrayData = Object.values(Object.groupBy(updatedOptions, (opt) => opt.question_id)).map((opts) => opts.sort((a, b) => a.option_id - b.option_id).map((opt) => opt.vote_count));

            // Broadcast updated options with pollId
            io.to(`poll-${pollId}`).emit('updateVotes', { pollId, arrayData });
            console.log(`[vote] Broadcast updated voting options:`, { pollId, updatedOptions, arrayData });
        } catch (err) {
            console.error('[vote] Error:', err);
            socket.emit('voteError', { message: 'Voting failed, please try again later.' });
        }
    });
};

// Payload structure for the vote event:
// {
//     "pollId": 1,
//     "answers": [
//       { "questionId": "q1", "optionId": "1" },
//       { "questionId": "q2", "optionId": "5" }
//     ]
//   }

// Data structure broadcasted after each vote:
// {
//     "pollId": 1,
//     "updatedOptions": [
//       { "question_id": "q1", "option_id": "1", "vote_count": 10 },
//       { "question_id": "q2", "option_id": "5", "vote_count": 5 }
//     ]
//   }
