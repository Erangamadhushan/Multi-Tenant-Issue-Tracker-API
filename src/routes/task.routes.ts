import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';
import { createTask, listTasks, updateTask } from '../services/task.service';

export const taskRoutes = Router();

taskRoutes.get('/:workspaceId/projects/:projectId/tasks', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const workspaceId = Array.isArray(req.params.workspaceId) ? req.params.workspaceId[0] : req.params.workspaceId;
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    res.status(200).json({ success: true, data: { tasks: await listTasks(workspaceId, projectId, req.user!.id) } });
  } catch (error) {
    next(error);
  }
});

taskRoutes.post('/:workspaceId/projects/:projectId/tasks', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const workspaceId = Array.isArray(req.params.workspaceId) ? req.params.workspaceId[0] : req.params.workspaceId;
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const payload = createTaskSchema.parse(req.body);
    const task = await createTask(workspaceId, projectId, req.user!.id, payload);
    res.status(201).json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
});

taskRoutes.patch('/:workspaceId/projects/:projectId/tasks/:taskId', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const workspaceId = Array.isArray(req.params.workspaceId) ? req.params.workspaceId[0] : req.params.workspaceId;
    const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
    const taskId = Array.isArray(req.params.taskId) ? req.params.taskId[0] : req.params.taskId;
    const payload = updateTaskSchema.parse(req.body);
    const task = await updateTask(workspaceId, projectId, taskId, req.user!.id, payload);
    res.status(200).json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
});
