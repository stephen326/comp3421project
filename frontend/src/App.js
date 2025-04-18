import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePoll from './components/CreatePoll'; // 导入创建投票组件
import Home from './components/Home'; // 导入主页组件

function App() {
    return (
        <Router>
            {/* 定义路由规则 */}
            <Routes>
                {/* 路由：创建投票页面 */}
                <Route path="/" element={<Home />} />
                <Route path="/create-poll" element={<CreatePoll />} />
                {/* 其他路由可以在这里添加 */}
            </Routes>
        </Router>
    );
}

export default App; // 导出 App 组件，供其他文件使用