const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TaskHistory = sequelize.define('TaskHistory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        taskName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        serverId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('running', 'completed', 'failed'),
            defaultValue: 'running'
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        indexes: [
            {
                fields: ['taskName']
            },
            {
                fields: ['serverId']
            },
            {
                fields: ['status']
            }
        ]
    });

    return TaskHistory;
}; 