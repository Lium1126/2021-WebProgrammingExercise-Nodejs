'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    mail: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
}