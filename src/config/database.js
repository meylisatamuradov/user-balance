import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});