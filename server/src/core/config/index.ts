import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT || '0000'),
  MONGODB_URI: process.env.MONGODB_URI || '',
  CORS_ORIGINS: process.env.CORS_ORIGINS,
  JWT_SECRET: process.env.JWT_SECRET,
};