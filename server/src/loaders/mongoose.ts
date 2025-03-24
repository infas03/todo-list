import mongoose from 'mongoose';
import { config } from '../core/config';
import { logger } from '../core/utils/logger';

let connection: mongoose.Connection;

export const connectDB = async (): Promise<void> => {
  if (connection) return;

  try {
    mongoose.set('strictQuery', false);
    mongoose.set('debug', config.NODE_ENV === 'development');

    connection = await mongoose
      .connect(config.MONGODB_URI)
      .then(conn => conn.connection);

    logger.info('Database connected successfully');

    connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!connection) return;
  await mongoose.disconnect();
  logger.info('Database disconnected');
};