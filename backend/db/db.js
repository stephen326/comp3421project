const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load configuration from .env file
dotenv.config();

// Create a database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // Read database host from .env file
    user: process.env.DB_USER,       // Read database username from .env file
    password: process.env.DB_PASSWORD, // Read database password from .env file
    database: process.env.DB_DATABASE, // Read database name from .env file
    port: process.env.DB_PORT,       // Read database port from .env file
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the MySQL server!');
        connection.release();
    }
});

// Export the database connection pool
module.exports = pool.promise();