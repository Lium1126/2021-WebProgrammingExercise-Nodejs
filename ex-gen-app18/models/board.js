'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "利用者は必須です。"
        }
      }
    },
    message: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "メッセージは必須です。"
        }
      }
    }
  }, {});
  Board.associate = function(models) {
    Board.belongsTo(models.User);
  };
  return Board;
};