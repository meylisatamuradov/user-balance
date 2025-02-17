import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { sequelize } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
