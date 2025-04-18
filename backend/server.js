// backend/server.js
const express = require('express');
const app = express();
const port = 5000;

// 允许跨域请求
const cors = require('cors');
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 一个简单的 API 路由
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
