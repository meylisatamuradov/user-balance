const { v4: uuidv4 } = require('uuid');
const { TaskHistory } = require('../models');

class TaskScheduler {
    constructor(rabbitmqService) {
        this.rabbitmq = rabbitmqService;
        this.serverId = uuidv4();
        this.activeTasks = new Map();
        this.tasks = this.defineBackgroundTasks();
    }

    defineBackgroundTasks() {
        return [
            {
                name: 'dataProcessing1',
                interval: 5 * 60 * 1000,
                handler: async () => {
                    console.log('Processing data task 1');
                    await this.simulateWork();
                }
            },
            {
                name: 'emailProcessing',
                interval: 7 * 60 * 1000,
                handler: async () => {
                    console.log('Processing emails');
                    await this.simulateWork();
                }
            },
            {
                name: 'imageProcessing',
                interval: 10 * 60 * 1000,
                handler: async () => {
                    console.log('Processing images');
                    await this.simulateWork();
                }
            },
            // Add 7 more tasks here...
        ];
    }

    async simulateWork() {
        const workTime = 2 * 60 * 1000 + Math.random() * 30000;
        await new Promise(resolve => setTimeout(resolve, workTime));
    }

    async start() {
        // Start consuming tasks
        await this.rabbitmq.channel.consume('tasks_queue', async (msg) => {
            if (msg !== null) {
                const taskData = JSON.parse(msg.content.toString());
                await this.executeTask(taskData);
                this.rabbitmq.channel.ack(msg);
            }
        });

        // Schedule tasks
        for (const task of this.tasks) {
            this.scheduleTask(task);
        }
    }

    async scheduleTask(task) {
        const schedule = async () => {
            const taskData = {
                name: task.name,
                scheduledTime: new Date(),
                serverId: this.serverId
            };

            await this.rabbitmq.channel.sendToQueue(
                'tasks_queue',
                Buffer.from(JSON.stringify(taskData)),
                { persistent: true }
            );
        };

        setInterval(schedule, task.interval);
        schedule(); // Initial execution
    }

    async executeTask(taskData) {
        const task = this.tasks.find(t => t.name === taskData.name);
        if (!task) return;

        const taskRecord = await TaskHistory.create({
            taskName: task.name,
            serverId: this.serverId,
            startTime: new Date(),
            status: 'running'
        });

        try {
            await task.handler();

            await taskRecord.update({
                endTime: new Date(),
                status: 'completed'
            });

            await this.rabbitmq.channel.publish(
                'task_status',
                '',
                Buffer.from(JSON.stringify({
                    taskName: task.name,
                    status: 'completed',
                    serverId: this.serverId,
                    endTime: new Date()
                }))
            );
        } catch (error) {
            console.error(`Task ${task.name} failed:`, error);
            
            await taskRecord.update({
                endTime: new Date(),
                status: 'failed',
                error: error.message
            });
        } finally {
            this.activeTasks.delete(task.name);
        }
    }

    getActiveTasksStatus() {
        return this.tasks.map(task => {
            const activeTask = this.activeTasks.get(task.name);
            return {
                name: task.name,
                status: activeTask ? 'running' : 'waiting',
                serverId: activeTask?.serverId,
                runningTime: activeTask ? 
                    Math.floor((Date.now() - activeTask.startTime.getTime()) / 1000) : 
                    null,
                interval: task.interval / 1000
            };
        });
    }
}

module.exports = TaskScheduler; 