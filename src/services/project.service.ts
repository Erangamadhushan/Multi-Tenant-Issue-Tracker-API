import { Project, projects, randomId, workspaces } from '../data/store';
import { getDatabase } from '../config/db';

export const listProjects = async (workspaceId: string, ownerId: string) => {
  const database = await getDatabase();
  const workspace = database
    ? await database.collection('workspaces').findOne({ id: workspaceId, ownerId })
    : workspaces.find((entry) => entry.id === workspaceId && entry.ownerId === ownerId);
  if (!workspace) {
    throw Object.assign(new Error('Workspace not found'), { status: 404 });
  }

  return database
    ? database.collection<Project>('projects').find({ workspaceId }).sort({ createdAt: 1 }).toArray()
    : projects.filter((project) => project.workspaceId === workspaceId);
};

export const createProject = (
  workspaceId: string,
  ownerId: string,
  { name, description, status }: { name: string; description: string; status: 'active' | 'archived' }
) => {
  return createProjectInStore(workspaceId, ownerId, { name, description, status });
};

const createProjectInStore = async (
  workspaceId: string,
  ownerId: string,
  { name, description, status }: { name: string; description: string; status: 'active' | 'archived' }
) => {
  const database = await getDatabase();
  const workspace = database
    ? await database.collection('workspaces').findOne({ id: workspaceId, ownerId })
    : workspaces.find((entry) => entry.id === workspaceId && entry.ownerId === ownerId);
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

  if (database) {
    await database.collection<Project>('projects').insertOne(project);
  } else {
    projects.push(project);
  }
  return project;
};
