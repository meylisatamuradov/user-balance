# Distributed Task Processing System

A scalable distributed task processing system built with Node.js, RabbitMQ, and MongoDB, featuring load balancing and parallel task execution.

## System Architecture

- **Load Balancer (Nginx)**: Distributes incoming API requests across multiple application instances
- **Message Queue (RabbitMQ)**: Handles distributed task scheduling and execution
- **Database (MongoDB)**: Stores task execution history
- **Application Instances**: Multiple Node.js servers processing tasks in parallel

## Features

- Parallel processing with 5+ application instances
- 10 background tasks with configurable intervals
- Minimum 2-minute task execution time
- Distributed task locking to prevent duplicate execution
- Real-time task status monitoring
- Task execution history
- No master server (peer-to-peer architecture)
- Automatic task distribution across instances
- Fault tolerance and high availability

## Prerequisites

- Docker and Docker Compose
- Node.js 16+
- MongoDB
- RabbitMQ
- Nginx

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start PostgreSQL:
```bash
npm run docker:up
```

4. Initialize database and run migrations:
```bash
npm run init
```

5. Start the application:
```bash
npm start
```

## Running Tests
```bash
npm test
```

## Docker Commands
- Start containers: `npm run docker:up`
- Stop containers: `npm run docker:down`
- View logs: `npm run docker:logs`

## API Endpoints
POST /api/users/balance/update
```json
{
  "userId": 1,
  "amount": -2
}
```

## test.js
- run the server and in a new terminal tab u can run concurrect requests in test.js: `node test.js`
