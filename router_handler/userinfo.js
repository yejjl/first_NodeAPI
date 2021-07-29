//导入数据库操作模块
const db = require('../db/index');

// 获取用户基本信息
exports.getuserinfo = (req, res) => {
	//定义数据库查询语句
	const sql =
		'select id,username,nickname,email,user_pic from ev_users where id=?';
	db.query(sql, req.user.id, (err, results) => {
		//执行语句失败
		if (err) return res.cc(err);
		//执行语句成功，但查询结果为零
		if (results.length !== 1) return res.cc('获取用户信息失败');

		//用户信息获取成功
		res.send({
			status: 0,
			message: '获取用户信息成功',
			data: results[0],
		});
	});
};
//更新用户信息
exports.updateuserinfo = (req, res) => {
	//定义数据库查询语句
	const sql = 'update ev_users set ? where id=?';
	db.query(sql, [req.body, req.body.id], (err, results) => {
		//语句执行失败
		if (err) return res.cc(err);
		//影响行数不为1
		if (results.affectedRows !== 1) return res.cc('更新信息失败2');

		//成功
		res.cc('更新信息成功', 0);
	});
};
