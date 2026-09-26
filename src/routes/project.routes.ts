import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createProjectSchema } from '../validators/project.validator';
import { createProject, listProjects } from '../services/project.service';

export const projectRoutes = Router();

projectRoutes.get('/:workspaceId/projects', requireAuth, (req, res, next) => {
  try {
    const workspaceId = Array.isArray(req.params.workspaceId) ? req.params.workspaceId[0] : req.params.workspaceId;
    res.status(200).json({ success: true, data: { projects: listProjects(workspaceId) } });
  } catch (error) {
    next(error);
  }
});

projectRoutes.post('/:workspaceId/projects', requireAuth, (req, res, next) => {
  try {
    const workspaceId = Array.isArray(req.params.workspaceId) ? req.params.workspaceId[0] : req.params.workspaceId;
    const payload = createProjectSchema.parse(req.body);
    const project = createProject(workspaceId, payload);
    res.status(201).json({ success: true, data: { project } });
  } catch (error) {
    next(error);
  }
});
