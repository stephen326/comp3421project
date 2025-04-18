const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { initializeDatabase } = require('./db/initDb');

// Import routes
// ==========================================
const dbTestRouter = require('./routes/dbTest');
const pollsRouter = require('./routes/polls');

// Create Express app
// ==========================================
const app = express();
const port = process.env.PORT || 5000;


// Middleware
// ==========================================
app.use(cors());
app.use(express.json());


// 数据库初始化
initializeDatabase()
    .then(() => {
        console.log('数据库初始化完成！');
    })
    .catch((err) => {
        console.error('数据库初始化失败:', err);
    });


// Routes
// ==========================================
app.get('/', (req, res) => {
    res.send('Welcome to the backend server! Use /api/db-test or /api/polls to access the APIs.');
});
app.use('/api/db-test', dbTestRouter);
app.use('/api/polls', pollsRouter);


// websocket register
// ==========================================
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const pollSocket = require('./pollSocket'); // 👈 你要创建的文件

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log('✅ 有客户端连接:', socket.id);
    pollSocket(io, socket);
});

// Start the server
// ==========================================
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});