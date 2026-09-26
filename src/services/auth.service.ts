import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { createWorkspace } from './workspace.service';
import { randomId, User, users } from '../data/store';
import { getDatabase } from '../config/db';

export const registerUser = async ({ email, password, name }: { email: string; password: string; name: string }) => {
  const database = await getDatabase();
  const existing = database ? await database.collection<User>('users').findOne({ email }) : users.find((user) => user.email === email);
  if (existing) {
    throw Object.assign(new Error('User already exists'), { status: 409 });
  }

  const user: User = {
    id: randomId(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  if (database) {
    await database.collection<User>('users').insertOne(user);
  } else {
    users.push(user);
  }
  const workspace = await createWorkspace(user.id, {
    name: `${user.name}'s Workspace`,
    slug: `${user.id}-workspace`,
  });

  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    workspace,
    token: jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET),
  };
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const database = await getDatabase();
  const user = database
    ? await database.collection<User>('users').findOne({ email, password })
    : users.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token: jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET),
  };
};
