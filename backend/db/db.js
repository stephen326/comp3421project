const mysql = require('mysql2');

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ Failed to get connection from pool:', err);
    return;
  }
  console.log('✅ Got connection from pool!');
  conn.release(); // 用完记得放回连接池
});

module.exports = pool;
