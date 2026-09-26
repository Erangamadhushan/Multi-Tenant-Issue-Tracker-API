export type Status = 'todo' | 'in_progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description: string;
  status: Status;
  assigneeId?: string;
  createdAt: string;
}

export const users: User[] = [];
export const workspaces: Workspace[] = [];
export const projects: Project[] = [];
export const tasks: Task[] = [];

export const resetStores = () => {
  users.length = 0;
  workspaces.length = 0;
  projects.length = 0;
  tasks.length = 0;
};

export const randomId = () => Math.random().toString(36).slice(2, 11);
