const express = require('express');
const router = express.Router();

// バリデーション用
const { check, validationResult } = require('express-validator');

const sqlite3 = require('sqlite3');

// データベースオブジェクトの取得
const db = new sqlite3.Database('mydb.sqlite3');

// GETアクセスの処理
router.get('/', (req, res, next) => {
	// データベースのシリアライズ
	db.serialize(() => {
		var rows = "";
		db.each("select * from mydata", (err, row) => {
			if (!err) {
				rows += "<tr><th>" + row.id + "</th><td>"
					+ row.name + "</td><td></tr>";
			}
		},
			(err, count) => {
				if (!err) {
					var data = {
						title: "Hello!",
						content: rows
					};
					res.render('hello/index', data);
				}
			});
	});
});

// /hello/addアクセス時の処理
router.get('/add', (req, res, next) => {
	var data = {
		title: 'Hello/Add',
		content: '新しいレコードを入力：',
		form: { name: '', mail: '', age: 0 }
	}
	res.render('hello/add', data);
});

router.post('/add', [
	check('name', 'NAME は必ず入力してください。').notEmpty().escape(),
	check('mail', 'MAILはメールアドレスを記入してください。').isEmail().escape(),
	check('age', 'AGEは年齢(整数)を入力してください。').isInt(),
	check('age', 'AGEは0以上120以下で入力してください。').custom(value => {
		return 0 <= value & value <= 120;
	})
], (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		var result = '<ul class="text-danger">';
		var result_arr = errors.array();
		for (var n in result_arr) {
			result += '<li>' + result_arr[n].msg + '</li>';
		}
		result += '</ul>';
		var data = {
			title: 'Hello/Add',
			content: result,
			form: req.body
		}
		res.render('hello/add', data);
	} else {
		const nm = req.body.name;
		const ml = req.body.mail;
		const ag = req.body.age;
		db.serialize(() => {
			db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag);
		});
		res.redirect('/hello');
	}
});

// /hello/showアクセス時の処理
router.get('/show', (req, res, next) => {
	const id = req.query.id;
	db.serialize(() => {
		const q = "select * from mydata where id = ?";
		db.get(q, [id], (err, row) => {
			if (!err) {
				var data = {
					title: 'Hello/Show',
					content: 'id = ' + id + ' のレコード',
					mydata: row
				}
				res.render('hello/show', data);
			}
		});
	});
});

// /hello/editアクセス時の処理
router.get('/edit', (req, res, next) => {
	const id = req.query.id;
	db.serialize(() => {
		const q = "select * from mydata where id = ?";
		db.get(q, [id], (err, row) => {
			if (!err) {
				var data = {
					title: 'Hello/Edit',
					content: 'id = ' + id + ' のレコードを編集：',
					mydata: row
				}
				res.render('hello/edit', data);
			}
		});
	});
});

router.post('/edit', (req, res, next) => {
	const id = req.body.id;
	const nm = req.body.name;
	const ml = req.body.mail;
	const ag = req.body.age;
	const q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
	db.serialize(() => {
		db.run(q, nm, ml, ag, id);
	});
	res.redirect('/hello');
});

// /hello/deleteアクセス時の処理
router.get('/delete', (req, res, next) => {
	const id = req.query.id;
	db.serialize(() => {
		const q = "select * from mydata where id = ?";
		db.get(q, [id], (err, row) => {
			if (!err) {
				var data = {
					title: 'Hello/Delete',
					content: 'id = ' + id + ' のレコードを削除：',
					mydata: row
				};
				res.render('hello/delete', data);
			}
		});
	});
});

router.post('/delete', (req, res, next) => {
	const id = req.body.id;
	db.serialize(() => {
		const q = "delete from mydata where id = ?";
		db.run(q, id);
	});
	res.redirect('/hello');
});

// /hello/findアクセス時の処理
router.get('/find', (req, res, next) => {
	db.serialize(() => {
		db.all("select * from mydata", (err, rows) => {
			if (!err) {
				var data = {
					title: 'Hello/Find',
					find: '',
					content: '検索条件を入力してください。',
					mydata: rows
				};
				res.render('hello/find', data);
			}
		});
	});
});

router.post('/find', (req, res, next) => {
	var find = req.body.find;
	db.serialize(() => {
		var q = "select * from mydata where ";
		db.all(q + find, [], (err, rows) => {
			if (!err) {
				var data = {
					title: 'Hello/Find',
					find: find,
					content: '検索条件　' + find,
					mydata: rows
				};
				res.render('hello/find', data);
			}
		});
	});
});

module.exports = router;