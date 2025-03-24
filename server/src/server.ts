import express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import authRoutes from './api/auth/routes';
import taskRoutes from './api/tasks/routes';
import { connectDB } from './core/database';
import { errorHandler } from './core/middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;