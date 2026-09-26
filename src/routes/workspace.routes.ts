import { Router } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { createWorkspaceSchema } from '../validators/workspace.validator';
import { createWorkspace, listWorkspaces } from '../services/workspace.service';

export const workspaceRoutes = Router();

workspaceRoutes.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    res.status(200).json({ success: true, data: { workspaces: await listWorkspaces(req.user!.id) } });
  } catch (error) {
    next(error);
  }
});

workspaceRoutes.post('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const payload = createWorkspaceSchema.parse(req.body);
    const workspace = await createWorkspace(req.user!.id, payload);
    res.status(201).json({ success: true, data: { workspace } });
  } catch (error) {
    next(error);
  }
});
