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

//注册和登录表单的验证对象
exports.reg_login_schema = {
	body: {
		username,
		password,
	},
};
