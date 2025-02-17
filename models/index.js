const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false
});

const TaskHistory = require('./TaskHistory')(sequelize);

module.exports = {
    sequelize,
    TaskHistory
}; 