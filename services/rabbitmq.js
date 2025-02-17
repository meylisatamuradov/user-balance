const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            
            // Assert task queue
            await this.channel.assertQueue('tasks_queue', {
                durable: true
            });

            // Assert exchange for task status updates
            await this.channel.assertExchange('task_status', 'fanout', {
                durable: true
            });

            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('RabbitMQ connection error:', error);
            throw error;
        }
    }

    async close() {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}

module.exports = RabbitMQService; 