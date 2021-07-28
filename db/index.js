const mysql = require('mysql');

//创建连接对象
const db = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: '0000',
	database: 'fun',
});

module.exports = db;
