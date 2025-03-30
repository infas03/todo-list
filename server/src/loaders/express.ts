import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { config } from '../core/config';
import routes from '../routes/index'

export const loadExpressApp = (): Application => {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: config.CORS_ORIGINS?.split(','),
    credentials: true
  }));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', routes); 

  if (config.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }
  app.get('/', (_: express.Request, res: express.Response) => {
    res.status(200).send('Server is running');
  });

  app.get('/health', (_: express.Request, res: express.Response) => {
    res.status(200).send('OK');
  });

  return app;
};