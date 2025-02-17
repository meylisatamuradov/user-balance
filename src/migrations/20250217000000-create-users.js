import { Sequelize } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  
    // Add initial user with 10,000 balance
    await queryInterface.bulkInsert('users', [{
      balance: 10000,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  };
  
  export const down = async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users');
  };
  