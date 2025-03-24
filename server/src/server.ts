import { config } from './core/config';
import { logger } from './core/utils/logger';
import { loadExpressApp } from './loaders/express';
import { connectDB } from './loaders/mongoose';
import routes from './routes';

const startServer = async () => {
  await connectDB();
  const app = loadExpressApp();
  
  app.use('/api', routes); 
  
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
  });
};

startServer().catch(err => {
  logger.error('Server startup failed:', err);
  process.exit(1);
});