const express = require('express');

const joi = require('@hapi/joi');
//创建实例对象
const app = express();

//配置cors中间件
const cors = require('cors');
app.use(cors());

//配置表单解析中间件,仅application/x-www-form-urlencoded格式
app.use(express.urlencoded({ extended: false }));

//在路由之前，封装res.cc函数
app.use((req, res, next) => {
	//status 默认值为1，表示失败的情况
	//err的值，可能是一个错误对象，也可能是一个描述字符串
	res.cc = (err, status = 1) => {
		res.send({
			status,
			message: err instanceof Error ? err.message : err,
		});
	};
	next();
});

//导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

//定义错误中间件
app.use((err, req, res, next) => {
	//验证失败导致的错误
	if (err instanceof joi.ValidationError) return res.cc(err);
	//未知错误
	res.cc(err);
});

//启动服务器
app.listen(3007, () => {
	console.log('api server running at http://127.0.0.1:3007');
});
