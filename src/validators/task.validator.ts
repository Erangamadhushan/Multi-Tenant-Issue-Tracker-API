import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(''),
  assigneeId: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});
