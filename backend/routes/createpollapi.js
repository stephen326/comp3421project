const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // Import connection pool

router.post('/', async (req, res) => {
    const { title, description, questions } = req.body;

    console.log('Request body:', JSON.stringify(req.body, null, 2));

    if (!title || !description || !questions || questions.length === 0) {
        return res.status(400).json({ error: 'Title, description, or questions cannot be empty, and at least one question is required!' });
    }

    for (const question of questions) {
        if (!question.title || !question.options || question.options.length === 0) {
            return res.status(400).json({ error: 'Each question must have a title and at least one option!' });
        }

        if (question.options.some(option => !option)) {
            return res.status(400).json({ error: 'Option content cannot be empty!' });
        }
    }

    console.log('Validation passed, starting data insertion...');

    let connection;
    try {
        // Get connection from the pool
        console.log('Attempting to get connection from the pool...');
        connection = await pool.getConnection();
        console.log('Successfully got connection from the pool!');

        // Start transaction
        await connection.beginTransaction();

        // Insert poll title and description into the polls table
        const [pollResult] = await connection.query(
            'INSERT INTO polls (title, description) VALUES (?, ?)',
            [title, description]
        );
        const pollId = pollResult.insertId;
        console.log('Inserted poll ID:', pollId);

        // Global variable for generating question_id and option_id
        let globalQuestionId = 1;

        // Insert each question into the question table and options into the poll_options table
        for (const question of questions) {
            const { title: questionTitle, options } = question;

            // Insert question into the question table
            const [questionResult] = await connection.query(
                'INSERT INTO question (question_text) VALUES (?)',
                [questionTitle]
            );

            // Get the primary key ID of the inserted question
            const q_id = questionResult.insertId; // Get auto-increment primary key ID
            console.log(`Inserting question: ${questionTitle}, generated q_id: ${q_id}`);

            // Insert options into the poll_options table
            let optionId = 1; // Options for each question start from 1
            for (const optionText of options) {
                console.log(`Inserting option: ${optionText}, associated q_id: ${q_id}, optionId: ${optionId}`);
                await connection.query(
                    'INSERT INTO poll_options (poll_id, q_id, question_id, option_id, option_text) VALUES (?, ?, ?, ?, ?)',
                    [pollId, q_id, q_id, optionId++, optionText] // Assuming question_id and q_id are the same
                );
            }
        }

        // Commit transaction
        await connection.commit();
        console.log('Transaction committed successfully!');

        // Return poll links
        const queryLink = `http://34.92.76.169:3000/query-page/${pollId}`; // Poll page link
        const resultLink = `http://34.92.76.169:3000/result-page/${pollId}`; // Result page link
        res.status(201).json({
            message: 'Poll created successfully!',
            queryLink,
            resultLink
        });
    } catch (error) {
        console.error('Error inserting data:', error);

        if (connection) {
            console.log('Rolling back transaction...');
            await connection.rollback();
            console.log('Transaction rolled back!');
        }

        res.status(500).json({ error: 'Internal server error', details: error.message });
    } finally {
        if (connection) {
            console.log('Releasing connection...');
            connection.release();
            console.log('Connection released!');
        }
    }
});

module.exports = router;
