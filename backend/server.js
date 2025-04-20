const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { initializeDatabase } = require('./db/initDb');

// Import routes
// ==========================================
const getResultRouter = require('./routes/getResult');
const createpollRouter = require('./routes/createpollapi'); // Routes related to creating polls

// Create Express app
// ==========================================
const app = express();
const port = process.env.PORT || 5000;

// Middleware
// ==========================================
app.use(cors());
app.use(express.json());

// Database initialization
initializeDatabase()
    .then(() => {
        console.log('Database initialization completed!');
    })
    .catch((err) => {
        console.error('Database initialization failed:', err);
    });

// Routes
// ==========================================
app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.use('/api/pollresult', getResultRouter); // Mount the route for fetching poll results to the /api/pollresult path

app.use('/api/createpoll', createpollRouter); // Mount the route for creating polls to the /api/createpoll path

// WebSocket registration
// ==========================================
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const pollSocket = require('./pollSocket'); // 👈 The file you need to create

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('✅ A client connected:', socket.id);
    pollSocket(io, socket);
});

// Start the server
// ==========================================
server.listen(port, () => {
    console.log(`Server running on http://34.150.45.164:${port}`);
});
