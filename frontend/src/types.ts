export type Status = 'todo' | 'in_progress' | 'done';

export interface User { id: string; name: string; email: string; createdAt: string; }
export interface Workspace { id: string; ownerId: string; name: string; slug: string; createdAt: string; }
export interface Project { id: string; workspaceId: string; name: string; description: string; status: 'active' | 'archived'; createdAt: string; }
export interface Task { id: string; projectId: string; workspaceId: string; title: string; description: string; status: Status; assigneeId?: string; createdAt: string; }
export interface AuthResult { user: User; token: string; workspace?: Workspace; }
