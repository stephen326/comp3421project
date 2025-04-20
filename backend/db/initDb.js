const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load configuration from .env file
dotenv.config();

// Create a connection without specifying a database
const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

async function initializeDatabase() {
    let connection;
    try {
        // Connect to MySQL server (without specifying a database)
        connection = await mysql.createConnection(connectionConfig);
        console.log('Successfully connected to MySQL server!');

        // Check if the database exists
        const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_DATABASE}'`);
        if (rows.length === 0) {
            // Create the database if it does not exist
            await connection.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
            console.log(`Database ${process.env.DB_DATABASE} created successfully!`);
        } else {
            console.log(`Database ${process.env.DB_DATABASE} already exists!`);
        }

        // Switch to the target database
        await connection.query(`USE ${process.env.DB_DATABASE}`);

        // Drop tables if they exist
        console.log('Checking and dropping tables if they exist...');
        await connection.query(`DROP TABLE IF EXISTS poll_options`);
        console.log('Table poll_options dropped if it existed');
        await connection.query(`DROP TABLE IF EXISTS polls`);
        console.log('Table polls dropped if it existed');
        await connection.query(`DROP TABLE IF EXISTS question`);
        console.log('Table question dropped if it existed');

        // Create polls table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS polls (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);
        console.log('Table created or already exists: polls');

        // Create question table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS question (
                id INT AUTO_INCREMENT PRIMARY KEY,
                question_text VARCHAR(255) NOT NULL
            );
        `);
        console.log('Table created or already exists: question');

        // Create poll_options table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS poll_options (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poll_id INT,
        q_id INT NOT NULL,
        question_id INT NOT NULL,
                option_id INT NOT NULL,
                option_text VARCHAR(255) NOT NULL,
                vote_count INT DEFAULT 0,
                FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
                FOREIGN KEY (q_id) REFERENCES question(id) ON DELETE CASCADE
            );
        `);
        console.log('Table created or already exists: poll_options');

      // FIXME: buggy
      // Insert sample survey data, one question with four options
      await connection.query(`
      INSERT INTO polls (title, description) VALUES
('Favorite Hobbies Survey', 'A survey to understand your favorite hobbies.'),
('City Preferences Poll', 'A poll to gauge preferences for city living.');
        `);
      await connection.query(`
      INSERT INTO question (question_text) VALUES
('Which outdoor activity do you enjoy most?'),
('Which indoor activity do you prefer?'),
('How often do you engage in hobbies?'),
('Which city feature is most important to you?'),
('What type of city vibe do you prefer?'),
('How long would you like to stay in a city?');
`);
      // Options
      await connection.query(`
      INSERT INTO poll_options (poll_id, q_id, question_id, option_id, option_text, vote_count) VALUES
-- Poll 1: Favorite Hobbies Survey
      -- Question 1: Which outdoor activity do you enjoy most?
      (1, 1, 1, 1, 'Hiking', 10),
      (1, 1, 1, 2, 'Cycling', 5),
      (1, 1, 1, 3, 'Swimming', 8),
-- Question 2: Which indoor activity do you prefer?
      (1, 2, 2, 1, 'Reading', 12),
      (1, 2, 2, 2, 'Gaming', 15),
      (1, 2, 2, 3, 'Cooking', 7),
-- Question 3: How often do you engage in hobbies?
      (1, 3, 3, 1, 'Daily', 20),
      (1, 3, 3, 2, 'Weekly', 10),
      (1, 3, 3, 3, 'Monthly', 5),
-- Poll 2: City Preferences Poll
-- Question 4: Which city feature is most important to you?
      (2, 4, 1, 1, 'Public Transport', 18),
      (2, 4, 1, 2, 'Green Spaces', 12),
      (2, 4, 1, 3, 'Cultural Events', 9),
-- Question 5: What type of city vibe do you prefer?
      (2, 5, 2, 1, 'Vibrant and Busy', 15),
      (2, 5, 2, 2, 'Calm and Relaxed', 10),
      (2, 5, 2, 3, 'Artsy and Creative', 8),
-- Question 6: How long would you like to stay in a city?
      (2, 6, 3, 1, 'A few months', 7),
      (2, 6, 3, 2, '1-2 years', 14),
      (2, 6, 3, 3, 'Permanently', 11);
        `);
    } catch (err) {
      console.error('Error initializing database:', err);
    } finally {
        if (connection) {
            await connection.end(); // Close the connection
        }
    }
}

// Export the function for use in other modules
module.exports = { initializeDatabase };
