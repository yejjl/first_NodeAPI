//这是路由处理函数模块

//导入数据库操作模块
const db = require('../db/index');

//获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
	//定义查询分类列表的 sql 语句
	const sql = `select * from ev_article_cate where is_delete=0 order by id asc`;
	//调用SQL语句
	db.query(sql, (err, results) => {
		if (err) return res.cc(err);

		res.send({
			status: 0,
			message: '获取文章分类数据成功',
			data: results,
		});
	});
};

//新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
	//定义查重的sql语句
	const sql = `select * from ev_article_cate where name=? or alias=?`;
	db.query(sql, [req.body.name, req.body.alias], (err, results) => {
		if (err) return res.cc(err);

		//判断数据的length
		if (results.length === 2)
			return res.cc('分类名称与分类别名被占用，请更换后再试');
		//length=1的三种情况
		if (
			results.length === 1 &&
			results[0].name === req.body.name &&
			results[0].alias === req.body.alias
		)
			return res.cc('分类名称与分类别名被占用，请更换后再试');
		if (results.length === 1 && results[0].name === req.body.name)
			return res.cc('分类名称被占用，请更换后再试');
		if (results.length === 1 && results[0].alias === req.body.alias)
			return res.cc('分类别名被占用，请更换后再试');

		//没有重复
		//定义文章插入的sql语句
		const sql = `insert into ev_article_cate set ?`;
		db.query(sql, req.body, (err, results) => {
			if (err) return res.cc(err);
			if (results.affectedRows !== 1) return res.cc('新增文章分类失败');
			res.cc('新增文章分类成功', 0);
		});
	});
};

//删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
	//定义标记删除文章分类的sql语句
	const sql = `update ev_article_cate set is_delete=1 where id=?`;
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err);
		if (results.affectedRows !== 1) return res.cc('删除文章分类失败');
		res.cc('删除文章分类成功');
	});
};

//根据id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
	//定义根据id获取文章分类的sql语句
	const sql = `select * from ev_article_cate where id=?`;
	db.query(sql, req.params.id, (err, results) => {
		if (err) return res.cc(err);
		if (results.length !== 1) return results.cc('获取文章分类数据失败');
		res.send({
			status: 0,
			message: '获取文章数据成功',
			data: results[0],
		});
	});
};

//根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
	//定义查重SQL语句
	const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`;
	db.query(
		sql,
		[req.body.Id, req.body.name, req.body.alias],
		(err, results) => {
			if (err) return res.cc(err);

			//判断名称和别名被占用的4种方式
			if (results.length === 2)
				return res.cc('分类名称与分类别名被占用，请更换后再试');
			if (
				results.length === 1 &&
				results[0].name === req.body.name &&
				results[0].alias === req.body.alias
			)
				return res.cc('分类名称与分类别名被占用，请更换后再试');
			if (results.length === 1 && results[0].name === req.body.name)
				return res.cc('分类名称被占用，请更换后再试');
			if (results.length === 1 && results[0].alias === req.body.alias)
				return res.cc('分类别名被占用，请更换后再试');

			//更新文章的SQL语句
			const sql = `update ev_article_cate set ? where Id=?`;
			db.query(sql, [req.body, req.body.Id], (err, results) => {
				if (err) return res.cc(err);

				if (results.affectedRows !== 1)
					return res.cc('更新文章分类失败');

				res.cc('更新文章分类成功', 0);
			});
		}
	);
};
