import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error-handler';
import { authRoutes } from './routes/auth.routes';
import { workspaceRoutes } from './routes/workspace.routes';
import { projectRoutes } from './routes/project.routes';
import { taskRoutes } from './routes/task.routes';
import { isDatabaseConnected } from './config/db';

export const createApp = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    const database = isDatabaseConnected() ? 'connected' : 'in_memory';
    res.status(200).json({ status: 'ok', services: { database } });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/workspaces', workspaceRoutes);
  app.use('/api/workspaces', projectRoutes);
  app.use('/api/workspaces', taskRoutes);

  app.use(errorHandler);

  return app;
};
