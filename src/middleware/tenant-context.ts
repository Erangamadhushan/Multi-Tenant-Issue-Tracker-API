import { NextFunction, Request, Response } from 'express';

export const tenantContext = (req: Request, _res: Response, next: NextFunction) => {
  const workspaceId = req.params.workspaceId ?? req.query.workspaceId;
  if (workspaceId) {
    req.headers['x-tenant-id'] = String(workspaceId);
  }
  next();
};
