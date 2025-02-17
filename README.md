# Balance Management API

## Prerequisites
- Node.js 16 or higher
- Docker and Docker Compose

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start PostgreSQL:
```bash
npm run docker:up
```

3. Initialize database and run migrations:
```bash
npm run init
```

4. Start the application:
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
