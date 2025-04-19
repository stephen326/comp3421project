const mysql = require('mysql2');

// 直接使用 Railway 注入的环境变量（无需 dotenv）
const connection = mysql.createConnection(process.env.DATABASE_URL);

// 测试数据库连接（建议保留）
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL');
});

module.exports = connection;
