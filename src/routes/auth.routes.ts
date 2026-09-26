import { Router } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { registerUser, loginUser } from '../services/auth.service';

export const authRoutes = Router();

authRoutes.post('/register', (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const result = registerUser(payload);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

authRoutes.post('/login', (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = loginUser(payload);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
