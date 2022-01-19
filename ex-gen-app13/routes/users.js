var express = require('express');
var router = express.Router();
const db = require('../models/index');

const { Op } = require("sequelize");

router.get('/', (req, res, next) => {
  const min = req.query.min * 1;
  const max = req.query.max * 1;
  db.User.findAll({
    where: {
      age: { [Op.gte]: min, [Op.lte]: max }
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
