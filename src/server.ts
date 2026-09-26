import { env } from './config/env';
import { connectDatabase } from './config/db';
import { createApp } from './app';

const startServer = async () => {
  await connectDatabase();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
};

void startServer();
