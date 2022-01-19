var express = require('express');
var router = express.Router();
const db = require('../models/index');

const { Op } = require("sequelize");

router.get('/', (req, res, next) => {
  const nm = req.query.name;
  db.User.findAll({
    where: {
      name: { [Op.like]: '%' + nm + '%' }
    }
  }).then(usrs => {
    var data = {
      title: 'Users/Index',
      content: usrs
    }
    res.render('users/index', data);
  });
});

module.exports = router;
