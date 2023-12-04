'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({ context: queryInterface }) {
    return queryInterface.bulkInsert('Users', [{
      balance: 100000,
    }]);
  },

  async down ({ context: queryInterface }) {
   return queryInterface.bulkDelete('Users', null, {});
  }
};
