'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "利用者IDは必須です。"
        }
      }
    },
    begin: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "開始日時は必須です。"
        }
      }
    },
    end: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "終了日時は必須です。"
        }
      }
    },
    place: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "場所は必須です。"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "内容は必須です。"
        }
      }
    },
  }, {});
  Schedule.associate = function(models) {
    Schedule.belongsTo(models.User);
  };
  return Schedule;
};