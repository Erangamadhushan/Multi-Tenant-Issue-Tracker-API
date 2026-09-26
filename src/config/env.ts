import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = value?.trim() ? Number(value) : fallback;
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  PORT: toNumber(process.env.PORT, 3000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/multi-tenant-issue-tracker',
};
