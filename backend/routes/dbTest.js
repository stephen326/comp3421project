const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Database test route is working!');
});

module.exports = router; // 确保正确导出 router