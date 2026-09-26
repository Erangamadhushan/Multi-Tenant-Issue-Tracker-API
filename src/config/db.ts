import { Db, MongoClient } from 'mongodb';
import { env } from './env';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectDatabase = async (): Promise<Db | null> => {
  if (db) return db;

  try {
    client = new MongoClient(env.MONGODB_URI);
    await client.connect();
    db = client.db();
    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('workspaces').createIndex({ ownerId: 1 }),
      db.collection('workspaces').createIndex({ slug: 1 }, { unique: true }),
      db.collection('projects').createIndex({ workspaceId: 1 }),
      db.collection('tasks').createIndex({ workspaceId: 1, projectId: 1 }),
    ]);
    return db;
  } catch (error) {
    console.warn('MongoDB unavailable, continuing in local in-memory mode:', (error as Error).message);
    db = null;
    if (client) {
      await client.close();
      client = null;
    }
    return null;
  }
    return null;
  }
};

export const getDatabase = async (): Promise<Db | null> => db;

export const isDatabaseConnected = () => db !== null;

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
