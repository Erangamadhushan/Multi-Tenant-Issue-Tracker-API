import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { randomId, User, users } from '../data/store';

export const registerUser = ({ email, password, name }: { email: string; password: string; name: string }) => {
  const existing = users.find((user) => user.email === email);
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

  users.push(user);

  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token: jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET),
  };
};

export const loginUser = ({ email, password }: { email: string; password: string }) => {
  const user = users.find((entry) => entry.email === email && entry.password === password);
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }

  return {
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token: jwt.sign({ id: user.id, email: user.email, name: user.name }, env.JWT_SECRET),
  };
};
