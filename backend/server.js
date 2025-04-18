const express = require('express'); // 引入 Express 框架，用于创建服务器和处理路由
const cors = require('cors'); // 引入 CORS 中间件，用于解决跨域问题
const dotenv = require('dotenv'); // 引入 dotenv，用于加载环境变量
const { initializeDatabase } = require('./db/initDb'); // 导入数据库初始化脚本

// 加载环境变量，加载 .env 文件中的配置
dotenv.config();

const app = express(); // 创建 Express 应用实例
const port = process.env.PORT || 5000; // 从环境变量中获取端口号，默认值为 5000

// 中间件
app.use(cors()); // 启用 CORS 中间件，允许跨域请求
app.use(express.json()); // 启用 JSON 解析中间件，解析请求体中的 JSON 数据

// 初始化数据库
initializeDatabase()
    .then(() => {
        console.log('数据库初始化完成！');
    })
    .catch((err) => {
        console.error('数据库初始化失败:', err);
    });

// 导入路由
const dbTestRouter = require('./routes/dbTest'); // 数据库测试相关的路由
const pollsRouter = require('./routes/polls'); // 投票功能相关的路由
const createpollRouter = require('./routes/createpollapi'); // 创建投票相关的路由

// 使用路由
// 添加根路径路由
app.get('/', (req, res) => {
    res.send('Welcome to the backend server! Use /api/db-test or /api/polls to access the APIs.');
});
app.use('/api/db-test', dbTestRouter); // 将数据库测试路由挂载到 /api/db-test 路径
app.use('/api/polls', pollsRouter); // 将投票功能路由挂载到 /api/polls 路径
app.use('/api/createpoll', createpollRouter); // 将创建投票路由挂载到 /api/createpoll 路径

// 启动服务器
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // 在控制台输出服务器运行的地址
});