'use strict';
module.exports = (sequelize, DataTypes) => {
  const Markdata = sequelize.define('Markdata', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "利用者は必須です。"
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "タイトルは必須です。"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "コンテンツは必須です。"
        }
      }
    }
  }, {});
  Markdata.associate = function(models) {
    Markdata.belongsTo(models.User);
  };
  return Markdata;
};