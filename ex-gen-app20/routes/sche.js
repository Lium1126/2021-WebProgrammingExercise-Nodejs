const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');

const pnum = 10;

// ログインチェックの関数
function check(req, res) {
	if (req.session.login == null) {
		req.session.back = '/sche/index';
		res.redirect('/users/login');
		return true;
	} else {
		return false;
	}
}

// トップページへのアクセス
router.get('/index', (req, res, next) => {
	if (check(req, res)) { return };
	db.Schedule.findAll({
		where: { userId: req.session.login.id },
		limit: pnum,
		order: [
			['createdAt', 'DESC']
		]
	}).then(sches => {
		var begindates = [], enddates = [];
		for (var i in sches) {
			begindates.push(makedatestr(sches[i].begin, false));
			enddates.push(makedatestr(sches[i].end, false));
		}
		var data = {
			title: 'Schedule',
			login: req.session.login,
			message: 'スケジュール一覧',
			form: { find: '' },
			content: sches,
			begindates: begindates,
			enddates: enddates
		};
		res.render('sche/index', data);
	});
});

// 新規作成ページの表示
router.get('/add', (req, res, next) => {
	if (check(req, res)) { return };
	res.render('sche/add', { title: 'Schedule/Add' });
});

// 新規作成フォームの送信処理
router.post('/add', (req, res, next) => {
	if (check(req, res)) { return };
	db.sequelize.sync()
	.then(() => db.Schedule.create({
		userId: req.session.login.id,
		begin: req.body.begin,
		end: req.body.end,
		place: req.body.place,
		content: req.body.content,
	})
	.then(model => {
		res.redirect('/sche/index');
	})
	);
});

// '/schedule'へアクセスした際のリダイレクト
router.get('/schedule', (req, res, next) => {
	res.redirect('/sche/index')
})

// 指定IDのSchedule表示
router.get('/edit/:id', (req, res, next) => {
	if (check(req, res)) { return };
	db.Schedule.findOne({
		where: {
			id: req.params.id,
			userId: req.session.login.id
		},
	})
	.then((model) => {
		makepage(req, res, model, true);
	});
});

// Scheduleの更新処理
router.post('/edit/:id', (req, res, next) => {
	if (check(req, res)) { return };
	db.Schedule.findByPk(req.params.id)
		.then(sch => {
			sch.begin = req.body.sourcebegin;
			sch.end = req.body.sourceend;
			sch.place = req.body.sourceplace;
			sch.content = req.body.source;
			sch.save().then((model) => {
				makepage(req, res, model, false);
			});
		});
});

router.get('/delete/:id', (req, res, next) => {
	if (check(req, res)) { return };
	db.Schedule.findByPk(req.params.id)
		.then(sch => {
			sch.destroy().then(() => res.redirect('/sche/index'));
		});
});

// 指定IDのSchedule表示ページ作成
function makepage(req, res, model, flg) {
	var footer;
	if (flg) {
		var d1 = new Date(model.createdAt);
		var dstr1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate();
		var d2 = new Date(model.updatedAt);
		var dstr2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate();
		footer = '(created: ' + dstr1 + ', updated: ' + dstr2 + ')';
	} else {
		footer = '(Updating date and time information...)';
	}
	var data = {
		title: 'Schedule',
		id: req.params.id,
		head: 'Schedule Update',
		footer: footer,
		content: model.content,
		source: model.content,
		sourcebegin: makedatestr(model.begin, true),
		sourceend: makedatestr(model.end, true),
		sourceplace: model.place
	};
	res.render('sche/edit', data);
}

function makedatestr(date, flg) {
	var d1 = new Date(date);
	var dstr1;
	if (flg) dstr1 = d1.getFullYear() + '-' + ('00' + (d1.getMonth() + 1)).slice(-2) + '-' + ('00' + d1.getDate()).slice(-2) + 'T' + ('00' + d1.getHours()).slice(-2) + ':' + ('00' + d1.getMinutes()).slice(-2);
	else dstr1 = d1.getFullYear() + '/' + ('00' + (d1.getMonth() + 1)).slice(-2) + '/' + ('00' + d1.getDate()).slice(-2) + ' ' + ('00' + d1.getHours()).slice(-2) + ':' + ('00' + d1.getMinutes()).slice(-2);
	return dstr1;
}

module.exports = router;