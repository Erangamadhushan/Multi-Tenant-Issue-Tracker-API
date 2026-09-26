import { randomId, Task, tasks, workspaces, projects } from '../data/store';
import { getDatabase } from '../config/db';

export const listTasks = async (workspaceId: string, projectId: string, ownerId: string) => {
  const database = await getDatabase();
  const workspace = database
    ? await database.collection('workspaces').findOne({ id: workspaceId, ownerId })
    : workspaces.find((entry) => entry.id === workspaceId && entry.ownerId === ownerId);
  const project = database
    ? await database.collection('projects').findOne({ id: projectId, workspaceId })
    : projects.find((entry) => entry.id === projectId && entry.workspaceId === workspaceId);

  if (!workspace || !project) {
    throw Object.assign(new Error('Project or workspace not found'), { status: 404 });
  }

  return database
    ? database.collection<Task>('tasks').find({ workspaceId, projectId }).sort({ createdAt: 1 }).toArray()
    : tasks.filter((task) => task.workspaceId === workspaceId && task.projectId === projectId);
};

export const createTask = async (
  workspaceId: string,
  projectId: string,
  ownerId: string,
  { title, description, assigneeId, status }: { title: string; description: string; assigneeId?: string; status: 'todo' | 'in_progress' | 'done' }
) => {
  const database = await getDatabase();
  const workspace = database
    ? await database.collection('workspaces').findOne({ id: workspaceId, ownerId })
    : workspaces.find((entry) => entry.id === workspaceId && entry.ownerId === ownerId);
  const project = database
    ? await database.collection('projects').findOne({ id: projectId, workspaceId })
    : projects.find((entry) => entry.id === projectId && entry.workspaceId === workspaceId);

  if (!workspace || !project) {
    throw Object.assign(new Error('Project or workspace not found'), { status: 404 });
  }

  const task: Task = {
    id: randomId(),
    projectId,
    workspaceId,
    title,
    description,
    assigneeId,
    status,
    createdAt: new Date().toISOString(),
  };

  if (database) {
    await database.collection<Task>('tasks').insertOne(task);
  } else {
    tasks.push(task);
  }
  return task;
};

export const updateTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  ownerId: string,
  patch: Partial<{ title: string; description: string; assigneeId: string; status: 'todo' | 'in_progress' | 'done' }>
) => {
  const database = await getDatabase();
  const workspace = database
    ? await database.collection('workspaces').findOne({ id: workspaceId, ownerId })
    : workspaces.find((entry) => entry.id === workspaceId && entry.ownerId === ownerId);
  if (!workspace) {
    throw Object.assign(new Error('Task not found'), { status: 404 });
  }

  if (database) {
    const result = await database.collection<Task>('tasks').findOneAndUpdate(
      { id: taskId, workspaceId, projectId },
      { $set: patch },
      { returnDocument: 'after' },
    );
    if (!result) throw Object.assign(new Error('Task not found'), { status: 404 });
    return result;
  }

  const task = tasks.find((entry) => entry.id === taskId && entry.workspaceId === workspaceId && entry.projectId === projectId);
  if (!task) throw Object.assign(new Error('Task not found'), { status: 404 });
  Object.assign(task, patch);
  return task;
};
