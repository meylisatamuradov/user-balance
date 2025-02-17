require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const RabbitMQService = require('./services/rabbitmq');
const TaskScheduler = require('./services/taskScheduler');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());

async function startServer() {
    // Connect to PostgreSQL
    await sequelize.sync();
    console.log('Connected to PostgreSQL');

    // Initialize RabbitMQ
    const rabbitmqService = new RabbitMQService();
    await rabbitmqService.connect();
    
    const taskScheduler = new TaskScheduler(rabbitmqService);
    await taskScheduler.start();

    // Routes
    app.use('/api/tasks', taskRoutes(taskScheduler));

    // Error handling
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

startServer().catch(console.error); 