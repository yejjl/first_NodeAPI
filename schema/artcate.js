//导入验证规则模块
const joi = require('@hapi/joi');

//定义name和alias的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();
//定义id验证规则
const id = joi.number().integer().min(1).required();

//向外共享验证规则对象
//添加分类
exports.add_cate_schema = {
	body: {
		name,
		alias,
	},
};
//根据id删除分类
exports.delete_cate_schema = {
	params: {
		id,
	},
};
//根据id获取文章分类
exports.get_cate_schema = {
	params: {
		id,
	},
};
//更新分类
exports.update_cate_schema = {
	body: {
		Id: id,
		name,
		alias,
	},
};
