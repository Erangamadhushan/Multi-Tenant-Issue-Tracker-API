import { Project, projects, randomId, workspaces } from '../data/store';

export const listProjects = (workspaceId: string) => {
  const workspace = workspaces.find((entry) => entry.id === workspaceId);
  if (!workspace) {
    throw Object.assign(new Error('Workspace not found'), { status: 404 });
  }

  return projects.filter((project) => project.workspaceId === workspaceId);
};

export const createProject = (
  workspaceId: string,
  { name, description, status }: { name: string; description: string; status: 'active' | 'archived' }
) => {
  const workspace = workspaces.find((entry) => entry.id === workspaceId);
  if (!workspace) {
    throw Object.assign(new Error('Workspace not found'), { status: 404 });
  }

  const project: Project = {
    id: randomId(),
    workspaceId,
    name,
    description,
    status,
    createdAt: new Date().toISOString(),
  };

  projects.push(project);
  return project;
};
