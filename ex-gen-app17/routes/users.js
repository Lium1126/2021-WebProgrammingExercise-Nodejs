var express = require('express');
var router = express.Router();
const db = require('../models/index');

const { Op } = require("sequelize");

router.get('/', (req, res, next) => {
  const nm = req.query.name;
  const ml = req.query.mail;
  db.User.findAll().then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    }
    res.render('users/index', data);
  });
});

router.get('/add', (req, res, next) => {
  var data = {
    title: 'Users/Add',
    form: new db.User(),
    err: null
  }
  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  const form = {
    name: req.body.name,
    pass: req.body.pass,
    mail: req.body.mail,
    age: req.body.age
  };
  db.sequelize.sync()
    .then(() => db.User.create(form)
      .then(usr => {
        res.redirect('/users')
      }))
    .catch(err => {
      var data = {
        title: 'User/Add',
        form: form,
        err: err
      }
      res.render('users/add', data);
    });
});

router.get('/edit', (req, res, next) => {
  db.User.findByPk(req.query.id)
    .then(usr => {
      var data = {
        title: 'Users/Edit',
        form: usr
      }
      res.render('users/edit', data);
    });
});

router.post('/edit', (req, res, next) => {
  db.sequelize.sync()
    .then(() => db.User.update({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    },
      {
        where: { id: req.body.id }
      }))
    .then(usr => {
      res.redirect('/users');
    });
});

router.get('/delete', (req, res, next) => {
  db.User.findByPk(req.query.id)
    .then(usr => {
      var data = {
        title: 'Users/Delete',
        form: usr
      }
      res.render('users/delete', data);
    });
});

router.post('/delete', (req, res, next) => {
  db.sequelize.sync()
    .then(() => db.User.destroy({
      where: { id: req.body.id }
    }))
    .then(usr => {
      res.redirect('/users');
    });
});

module.exports = router;
