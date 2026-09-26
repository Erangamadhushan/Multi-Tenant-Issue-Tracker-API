import { randomId, Task, tasks, workspaces, projects } from '../data/store';

export const listTasks = (workspaceId: string, projectId: string) => {
  const workspace = workspaces.find((entry) => entry.id === workspaceId);
  const project = projects.find((entry) => entry.id === projectId && entry.workspaceId === workspaceId);

  if (!workspace || !project) {
    throw Object.assign(new Error('Project or workspace not found'), { status: 404 });
  }

  return tasks.filter((task) => task.workspaceId === workspaceId && task.projectId === projectId);
};

export const createTask = (
  workspaceId: string,
  projectId: string,
  { title, description, assigneeId, status }: { title: string; description: string; assigneeId?: string; status: 'todo' | 'in_progress' | 'done' }
) => {
  const workspace = workspaces.find((entry) => entry.id === workspaceId);
  const project = projects.find((entry) => entry.id === projectId && entry.workspaceId === workspaceId);

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

  tasks.push(task);
  return task;
};

export const updateTask = (
  workspaceId: string,
  projectId: string,
  taskId: string,
  patch: Partial<{ title: string; description: string; assigneeId: string; status: 'todo' | 'in_progress' | 'done' }>
) => {
  const task = tasks.find((entry) => entry.id === taskId && entry.workspaceId === workspaceId && entry.projectId === projectId);
  if (!task) {
    throw Object.assign(new Error('Task not found'), { status: 404 });
  }

  Object.assign(task, patch);
  return task;
};
