//导入数据库操作模块
const db = require('../db/index');

//导入处理密码的模块
const bcrypt = require('bcryptjs');

// 获取用户基本信息
exports.getUserInfo = (req, res) => {
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
exports.updateUserInfo = (req, res) => {
	//定义数据库查询语句
	const sql = 'update ev_users set ? where id=?';
	db.query(sql, [req.body, req.body.id], (err, results) => {
		//语句执行失败
		if (err) return res.cc(err);
		//影响行数不为1
		if (results.affectedRows !== 1) return res.cc('更新信息失败');

		//成功
		res.cc('更新信息成功', 0);
	});
};
//更新密码
exports.updatePassword = (req, res) => {
	//定义数据库查询语句
	const sql = 'select * from ev_users where id=?';
	db.query(sql, req.user.id, (err, results) => {
		//语句执行失败
		if (err) return res.cc(err);
		//判断id是否存在
		if (results.length !== 1) return res.cc('用户不存在');
		//判断密码是否正确
		const compareResult = bcrypt.compareSync(
			req.body.oldPwd,
			results[0].password
		);
		if (!compareResult) return res.cc('旧密码错误');

		const sql = 'update ev_users set password=? where id=?';
		//对新密码加密
		const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
		db.query(sql, [newPwd, req.user.id], (req, results) => {
			//执行语句失败
			if (err) return res.cc(err);
			//判断影响行数
			if (results.affectedRows !== 1) return res.cc('更新密码失败');
			res.cc('更新密码成功', 0);
		});
	});
};

//更新头像
exports.updateAvatar = (req, res) => {
	//定义更新头像的ssql语句
	const sql = `update ev_users set user_pic=? where id=?`;
	db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
		//执行语句失败
		if (err) return res.cc(err);
		//判断影响行数
		if (results.affectedRows !== 1) return res.cc('更新头像失败');
		//成功
		res.cc('更换头像成功', 0);
	});
};
