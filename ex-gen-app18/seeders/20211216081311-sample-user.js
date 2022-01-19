'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Taro',
        pass: 'yamada',
        mail: 'taro@yamada.jp',
        age: 39,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Hanako',
        pass: 'flower',
        mail: 'hanako@flower.com',
        age: 28,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jiro',
        pass: 'change',
        mail: 'jiro@change.com',
        age: 17,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sachiko',
        pass: 'happy',
        mail: 'sachiko@happy.jp',
        age: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
