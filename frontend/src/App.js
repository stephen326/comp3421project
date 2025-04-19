import logo from './logo.svg';
import './index.css';
import React from 'react';
import ResultPage from './ResultPage';
import QueryPage from './QueryPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePoll from './components/CreatePoll'; // 导入创建投票组件
import Home from './components/Home'; // 导入主页组件
import Thank from './Thank'; // 导入感谢页面组件

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/query-page/:pollId" element={<QueryPage />} /> {/* 动态路由 */}
        <Route path="/result-page/:pollId" element={<ResultPage />} /> {/* 动态路由 */}
        <Route path="/thank/:pollId" element={<Thank />} />
      </Routes>
    </Router>
  );
}

export default App; // 导出 App 组件，供其他文件使用
