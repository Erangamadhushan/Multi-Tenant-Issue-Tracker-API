import { randomId, Workspace, workspaces } from '../data/store';

export const listWorkspaces = (userId: string) => {
  return workspaces.filter((workspace) => workspace.ownerId === userId);
};

export const createWorkspace = (ownerId: string, { name, slug }: { name: string; slug: string }) => {
  const existing = workspaces.find((workspace) => workspace.slug === slug);
  if (existing) {
    throw Object.assign(new Error('Workspace already exists'), { status: 409 });
  }

  const workspace: Workspace = {
    id: randomId(),
    ownerId,
    name,
    slug,
    createdAt: new Date().toISOString(),
  };

  workspaces.push(workspace);
  return workspace;
};
