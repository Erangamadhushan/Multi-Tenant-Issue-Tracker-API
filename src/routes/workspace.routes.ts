import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createWorkspaceSchema } from '../validators/workspace.validator';
import { createWorkspace, listWorkspaces } from '../services/workspace.service';

export const workspaceRoutes = Router();

workspaceRoutes.get('/', requireAuth, (_req, res, next) => {
  try {
    res.status(200).json({ success: true, data: { workspaces: listWorkspaces('current-user') } });
  } catch (error) {
    next(error);
  }
});

workspaceRoutes.post('/', requireAuth, (req, res, next) => {
  try {
    const payload = createWorkspaceSchema.parse(req.body);
    const workspace = createWorkspace(payload);
    res.status(201).json({ success: true, data: { workspace } });
  } catch (error) {
    next(error);
  }
});
