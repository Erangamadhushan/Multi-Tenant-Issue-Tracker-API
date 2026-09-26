import { Activity, ChevronDown, FolderKanban, LayoutGrid, LogOut, Plus, Settings2, Users } from 'lucide-react';
import type { Project, Workspace } from '../../types';
import { Button } from '../ui/Button';
import { cn, initials } from '../../lib/utils';

export function Sidebar({ userName, workspaces, workspace, projects, project, onWorkspace, onProject, onCreateWorkspace, onCreateProject, onLogout }: {
  userName: string; workspaces: Workspace[]; workspace?: Workspace; projects: Project[]; project?: Project; onWorkspace: (workspace: Workspace) => void; onProject: (project: Project) => void; onCreateWorkspace: () => void; onCreateProject: () => void; onLogout: () => void;
}) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">◒</div><span>orbit</span><span className="brand-pill">ISSUES</span></div>
    <div className="workspace-picker"><div className="workspace-avatar">{initials(workspace?.name ?? 'W')}</div><div className="workspace-copy"><span>Current workspace</span><strong>{workspace?.name ?? 'Choose a workspace'}</strong></div><ChevronDown size={16} /></div>
    <nav className="side-nav" aria-label="Primary navigation">
      <p className="nav-label">Workspace</p>
      <button className="nav-item active"><LayoutGrid size={17} />Overview</button>
      <button className="nav-item"><FolderKanban size={17} />Projects</button>
      <button className="nav-item"><Activity size={17} />Activity</button>
      <p className="nav-label nav-label-spaced">Manage</p>
      <button className="nav-item"><Users size={17} />Members</button>
      <button className="nav-item"><Settings2 size={17} />Settings</button>
    </nav>
    <div className="sidebar-section"><div className="section-heading"><span>Workspaces</span><Button variant="ghost" className="tiny-button" aria-label="Create workspace" onClick={onCreateWorkspace}><Plus size={15} /></Button></div>{workspaces.map((item) => <button key={item.id} className={cn('workspace-row', item.id === workspace?.id && 'selected')} onClick={() => onWorkspace(item)}><span className="workspace-dot" />{item.name}</button>)}</div>
    <div className="sidebar-section projects-section"><div className="section-heading"><span>Projects</span><Button variant="ghost" className="tiny-button" aria-label="Create project" onClick={onCreateProject}><Plus size={15} /></Button></div>{projects.map((item) => <button key={item.id} className={cn('workspace-row', item.id === project?.id && 'selected')} onClick={() => onProject(item)}><span className="project-symbol">#</span>{item.name}</button>)}</div>
    <div className="sidebar-user"><div className="user-avatar">{initials(userName)}</div><div><strong>{userName}</strong><span>Administrator</span></div><Button variant="ghost" className="icon-button" aria-label="Log out" onClick={onLogout}><LogOut size={16} /></Button></div>
  </aside>;
}
