import { randomId, Workspace, workspaces } from '../data/store';
import { getDatabase } from '../config/db';

export const listWorkspaces = async (userId: string) => {
  const database = await getDatabase();
  return database
    ? database.collection<Workspace>('workspaces').find({ ownerId: userId }).sort({ createdAt: 1 }).toArray()
    : workspaces.filter((workspace) => workspace.ownerId === userId);
};

export const createWorkspace = async (ownerId: string, { name, slug }: { name: string; slug: string }) => {
  const database = await getDatabase();
  const existing = database
    ? await database.collection<Workspace>('workspaces').findOne({ slug })
    : workspaces.find((workspace) => workspace.slug === slug);
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

  if (database) {
    await database.collection<Workspace>('workspaces').insertOne(workspace);
  } else {
    workspaces.push(workspace);
  }
  return workspace;
};
