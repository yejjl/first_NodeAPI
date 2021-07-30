const joi = require('@hapi/joi');

/**
 * string()值必须是字符串
 * alphanum()值只能是包含 a-zA-Z0-9 的字符串
 * min(length)最小值
 * max(length)最大值
 * required()值为必填项，不能为undefined
 * pattern(正则表达式)
 */

//用户名验证规则
const username = joi.string().alphanum().min(1).max(10).required();
//密码验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/);

//id验证规则
const id = joi.number().integer().min(1).required();
//昵称验证规则
const nickname = joi.string().required();
//email验证规则
const email = joi.string().email().required();
//data:image/png;base64,ve9ptufowvnq1jfvfm=
//定义头像验证规则
const avatar = joi.string().dataUri().required();

//注册和登录表单的验证对象
exports.reg_login_schema = {
	body: {
		username,
		password,
	},
};

//验证规则对象-更新用户基本信息
exports.update_userinfo_schema = {
	body: {
		id,
		nickname,
		email,
	},
};
//验证规则对象-修改密码
exports.update_password_schema = {
	body: {
		oldPwd: password,
		newPwd: joi.not(joi.ref('oldPwd')).concat(password),
	},
};
//验证规则对象-更新头像
exports.update_avatar_schema = {
	body: {
		avatar,
	},
};
