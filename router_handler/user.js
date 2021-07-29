//导入数据库模块
const db = require('../db/index');
//导入bcryptjs
const bcrypt = require('bcryptjs');
//导入生成token的包
const jwt = require('jsonwebtoken');
//导入全局配置文件
const config = require('../config');
//注册用户处理函数
exports.regUser = (req, res) => {
	//获取用户提交到服务器的信息
	const userinfo = req.body;

	//对表单数据进行合法性校验
	// if (!userinfo.username || !userinfo.password)
	// 	//return res.send({ status: 1, message: '用户名或密码不合法' });
	// 	return res.cc('用户名或密码不合法');

	//定义sql语句，查询用户名是否被占用
	const sqlStr = 'select * from ev_users where username=?';
	db.query(sqlStr, userinfo.username, (err, results) => {
		//判断执行sql语句失败
		if (err)
			//return res.send({ status: 1, message: err.message });
			return res.cc(err);

		//判断用户名是否占用
		if (results.length > 0)
			//return res.send({ status: 1, message: '用户名已被占用' });
			return res.cc('用户名已被占用');

		//用户名可以使用
		//调用bcrypt.hashSync(明文,随机盐长度),对密码加密
		userinfo.password = bcrypt.hashSync(userinfo.password, 10);
		//定义插入新数据的sql语句
		const sql = 'insert into ev_users set ?';
		db.query(
			sql,
			{
				username: userinfo.username,
				password: userinfo.password,
			},
			(err, results) => {
				//判断执行sql语句失败
				if (err)
					//return res.send({ status: 1, message: err.message });
					return res.cc(err);

				//判断影响行数是否为1
				if (results.affectedRows !== 1)
					//return res.send({ status: 1, message: '注册用户失败' });
					return res.cc('注册用户失败，请稍后再试');
				//注册成功
				//res.send({ status: 0, message: '注册成功' });
				res.cc('注册成功', 0);
			}
		);
	});
};

//登录处理函数
exports.login = (req, res) => {
	//接收表单数据
	const userinfo = req.body;
	//定义sql语句
	const sql = 'select * from ev_users where username=?';
	//执行sql语句，根据用户名查询用户信息
	db.query(sql, userinfo.username, (err, results) => {
		//执行语句失败
		if (err) return res.cc(err);
		//执行语句成功，但是获取到的数据条数不等于1
		if (results.length !== 1) return res.cc('登录失败');

		const compareResult = bcrypt.compareSync(
			userinfo.password,
			results[0].password
		);
		if (!compareResult) return res.cc('登录失败');

		//在服务器端生成token字段
		const user = { ...results[0], password: '', user_pic: '' };
		//对用户信息进行加密
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiresIn,
		});
		//将token响应给客户端
		res.send({
			status: 0,
			message: '登录成功',
			token: 'Bearer ' + tokenStr,
		});
	});
};
