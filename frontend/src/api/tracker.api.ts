import { api } from './client';
import type { AuthResult, Project, Task, Workspace, Status } from '../types';

type Envelope<T> = { success: boolean; data: T };

export const authApi = {
  login: (payload: { email: string; password: string }) => api.post<Envelope<AuthResult>>('/auth/login', payload),
  register: (payload: { email: string; password: string; name: string }) => api.post<Envelope<AuthResult>>('/auth/register', payload),
};

export const workspaceApi = {
  list: () => api.get<Envelope<{ workspaces: Workspace[] }>>('/workspaces'),
  create: (payload: { name: string; slug: string }) => api.post<Envelope<{ workspace: Workspace }>>('/workspaces', payload),
};

export const projectApi = {
  list: (workspaceId: string) => api.get<Envelope<{ projects: Project[] }>>(`/workspaces/${workspaceId}/projects`),
  create: (workspaceId: string, payload: { name: string; description: string; status: 'active' | 'archived' }) =>
    api.post<Envelope<{ project: Project }>>(`/workspaces/${workspaceId}/projects`, payload),
};

export const taskApi = {
  list: (workspaceId: string, projectId: string) => api.get<Envelope<{ tasks: Task[] }>>(`/workspaces/${workspaceId}/projects/${projectId}/tasks`),
  create: (workspaceId: string, projectId: string, payload: { title: string; description: string; status: Status }) =>
    api.post<Envelope<{ task: Task }>>(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, payload),
  update: (workspaceId: string, projectId: string, taskId: string, payload: Partial<Task>) =>
    api.patch<Envelope<{ task: Task }>>(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, payload),
};
