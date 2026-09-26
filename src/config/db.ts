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
    return db;
  } catch (error) {
    console.warn('MongoDB unavailable, continuing in local in-memory mode:', (error as Error).message);
    return null;
  }
};

export const getDatabase = async (): Promise<Db | null> => db ?? connectDatabase();

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
};
