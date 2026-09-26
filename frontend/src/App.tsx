import { useEffect, useState } from 'react';
import { ArrowUpRight, Check, CircleDot, Clock3, Inbox, LoaderCircle, Plus, RefreshCw, Search, Sparkles } from 'lucide-react';
import { apiMessage } from './api/client';
import { authApi, projectApi, taskApi, workspaceApi } from './api/tracker.api';
import type { AuthResult, Project, Status, Task, User, Workspace } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';

const emptyProjectForm = { name: '', description: '', status: 'active' as const };
const emptyTaskForm = { title: '', description: '', status: 'todo' as Status };

export function App() {
  const [session, setSession] = useState<{ user: User; token: string } | null>(() => {
    const token = localStorage.getItem('orbit-token');
    const user = localStorage.getItem('orbit-user');
    return token && user ? { token, user: JSON.parse(user) } : null;
  });
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspace, setWorkspace] = useState<Workspace>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [workspaceModal, setWorkspaceModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);

  const loadWorkspaces = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await workspaceApi.list();
      const nextWorkspaces = response.data.data.workspaces;
      setWorkspaces(nextWorkspaces);
      const nextWorkspace = nextWorkspaces.find((item) => item.id === workspace?.id) ?? nextWorkspaces[0];
      setWorkspace(nextWorkspace);
    } catch (requestError) { setError(apiMessage(requestError)); } finally { setLoading(false); }
  };

  const loadProjects = async (workspaceId: string) => {
    try {
      const response = await projectApi.list(workspaceId);
      const nextProjects = response.data.data.projects;
      setProjects(nextProjects);
      setProject((current) => nextProjects.find((item) => item.id === current?.id) ?? nextProjects[0]);
    } catch (requestError) { setError(apiMessage(requestError)); }
  };

  const loadTasks = async (workspaceId: string, projectId: string) => {
    try {
      const response = await taskApi.list(workspaceId, projectId);
      setTasks(response.data.data.tasks);
    } catch (requestError) { setError(apiMessage(requestError)); }
  };

  useEffect(() => { void loadWorkspaces(); }, [session]);
  useEffect(() => { if (workspace) void loadProjects(workspace.id); else { setProjects([]); setProject(undefined); } }, [workspace?.id]);
  useEffect(() => { if (workspace && project) void loadTasks(workspace.id, project.id); else setTasks([]); }, [workspace?.id, project?.id]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = authMode === 'login' ? await authApi.login({ email: authForm.email, password: authForm.password }) : await authApi.register(authForm);
      const result = response.data.data;
      localStorage.setItem('orbit-token', result.token); localStorage.setItem('orbit-user', JSON.stringify(result.user));
      setSession({ token: result.token, user: result.user });
    } catch (requestError) { setError(apiMessage(requestError)); } finally { setLoading(false); }
  };

  const handleCreateWorkspace = async (event: React.FormEvent) => {
    event.preventDefault();
    try { await workspaceApi.create({ name: workspaceName, slug: workspaceName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }); setWorkspaceName(''); setWorkspaceModal(false); await loadWorkspaces(); } catch (requestError) { setError(apiMessage(requestError)); }
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault(); if (!workspace) return;
    try { await projectApi.create(workspace.id, projectForm); setProjectForm(emptyProjectForm); setProjectModal(false); await loadProjects(workspace.id); } catch (requestError) { setError(apiMessage(requestError)); }
  };

  const handleCreateTask = async (event: React.FormEvent) => {
    event.preventDefault(); if (!workspace || !project) return;
    try { await taskApi.create(workspace.id, project.id, taskForm); setTaskForm(emptyTaskForm); setTaskModal(false); await loadTasks(workspace.id, project.id); } catch (requestError) { setError(apiMessage(requestError)); }
  };

  const updateStatus = async (task: Task, status: Status) => {
    if (!workspace || !project) return;
    try { const response = await taskApi.update(workspace.id, project.id, task.id, { status }); setTasks((current) => current.map((item) => item.id === task.id ? response.data.data.task : item)); } catch (requestError) { setError(apiMessage(requestError)); }
  };

  const logout = () => { localStorage.removeItem('orbit-token'); localStorage.removeItem('orbit-user'); setSession(null); };

  if (!session) return <AuthScreen mode={authMode} setMode={setAuthMode} form={authForm} setForm={setAuthForm} onSubmit={handleAuth} loading={loading} error={error} />;

  const completed = tasks.filter((task) => task.status === 'done').length;
  const active = tasks.filter((task) => task.status !== 'done').length;

  return <div className="app-shell">
    <Sidebar userName={session.user.name} workspaces={workspaces} workspace={workspace} projects={projects} project={project} onWorkspace={setWorkspace} onProject={setProject} onCreateWorkspace={() => setWorkspaceModal(true)} onCreateProject={() => setProjectModal(true)} onLogout={logout} />
    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{workspace?.name ?? 'Overview'}</strong></div><div className="top-actions"><button className="search-trigger"><Search size={16} />Search anything <kbd>Ctrl K</kbd></button><Button variant="ghost" className="top-link"><Sparkles size={16} />Ask Orbit</Button></div></header>
      <div className="content-wrap">
        {error && <div className="alert"><span>{error}</span><Button variant="ghost" className="alert-close" onClick={() => setError('')}>Dismiss</Button></div>}
        <section className="page-heading"><div><p className="eyebrow">{workspace?.slug ?? 'Your workspace'}</p><h1>Good morning, {session.user.name.split(' ')[0]}.</h1><p className="page-subtitle">Here is what is moving across your workspace today.</p></div><div className="heading-actions"><Button variant="secondary" onClick={() => workspace && loadProjects(workspace.id)}><RefreshCw size={16} />Refresh</Button><Button onClick={() => setTaskModal(true)} disabled={!project}><Plus size={16} />New task</Button></div></section>
        <section className="metric-grid"><Metric icon={<Inbox size={18} />} label="Open tasks" value={active} detail="Across selected project" tone="orange" /><Metric icon={<Check size={18} />} label="Completed" value={completed} detail="Keep the momentum" tone="green" /><Metric icon={<FolderKanbanIcon />} label="Projects" value={projects.length} detail="In this workspace" tone="blue" /><Metric icon={<CircleDot size={18} />} label="Workspace health" value="Good" detail="All systems nominal" tone="violet" /></section>
        <section className="workspace-grid"><div className="panel projects-panel"><div className="panel-heading"><div><p className="eyebrow">Selected workspace</p><h2>Projects</h2></div><Button variant="ghost" className="icon-button" aria-label="Create project" onClick={() => setProjectModal(true)}><Plus size={18} /></Button></div>{projects.length === 0 ? <EmptyState title="No projects yet" detail="Create a project to start organizing work." action="Create project" onAction={() => setProjectModal(true)} /> : <div className="project-list">{projects.map((item) => <button className={`project-card ${item.id === project?.id ? 'project-card-selected' : ''}`} key={item.id} onClick={() => setProject(item)}><div className="project-card-top"><span className="project-icon">#</span><Badge tone={item.status === 'active' ? 'green' : 'neutral'}>{item.status}</Badge></div><strong>{item.name}</strong><span>{item.description || 'No description added.'}</span><div className="project-card-footer"><span>{item.id === project?.id ? 'Viewing now' : 'Open project'}</span><ArrowUpRight size={15} /></div></button>)}</div>}</div>
          <div className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">Project pulse</p><h2>{project?.name ?? 'Select a project'}</h2></div>{project && <Badge tone="blue">{tasks.length} tasks</Badge>}</div>{project ? <div className="task-list">{tasks.length === 0 ? <EmptyState title="No tasks yet" detail="Add the first task to this project." action="Create task" onAction={() => setTaskModal(true)} /> : tasks.map((task) => <TaskRow key={task.id} task={task} onStatus={updateStatus} />)}</div> : <EmptyState title="Your context area is ready" detail="Pick a project from the left to see its tasks and activity." />}</div></section>
        <div className="status-line"><span className="status-dot" />API connected through the local workspace proxy <span className="status-separator">•</span> {loading ? 'Syncing data...' : 'Last synced just now'}</div>
      </div>
    </main>
    <Modal title="Create workspace" open={workspaceModal} onClose={() => setWorkspaceModal(false)}><form className="modal-form" onSubmit={handleCreateWorkspace}><label>Workspace name<Input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder="Northstar team" required /></label><Button type="submit">Create workspace</Button></form></Modal>
    <Modal title="Create project" open={projectModal} onClose={() => setProjectModal(false)}><form className="modal-form" onSubmit={handleCreateProject}><label>Project name<Input value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} placeholder="Website refresh" required /></label><label>Description<Input value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} placeholder="What is this project about?" /></label><Button type="submit" disabled={!workspace}>Create project</Button></form></Modal>
    <Modal title="Create task" open={taskModal} onClose={() => setTaskModal(false)}><form className="modal-form" onSubmit={handleCreateTask}><label>Task title<Input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="Write the first brief" required /></label><label>Description<Input value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} placeholder="Add context for your team" /></label><Button type="submit" disabled={!project}>Create task</Button></form></Modal>
  </div>;
}

function FolderKanbanIcon() { return <span className="metric-symbol">#</span>; }
function Metric({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string | number; detail: string; tone: string }) { return <div className="metric-card"><div className={`metric-icon metric-${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>; }
function EmptyState({ title, detail, action, onAction }: { title: string; detail: string; action?: string; onAction?: () => void }) { return <div className="empty-state"><div className="empty-icon"><Inbox size={20} /></div><strong>{title}</strong><span>{detail}</span>{action && onAction && <Button variant="secondary" onClick={onAction}>{action}</Button>}</div>; }
function TaskRow({ task, onStatus }: { task: Task; onStatus: (task: Task, status: Status) => void }) { const nextStatus: Status = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo'; return <div className="task-row"><button className={`task-check status-${task.status}`} aria-label={`Move ${task.title} to next status`} onClick={() => onStatus(task, nextStatus)}>{task.status === 'done' ? <Check size={13} /> : task.status === 'in_progress' ? <Clock3 size={13} /> : null}</button><div className="task-copy"><strong>{task.title}</strong><span>{task.description || 'No description'}</span></div><Badge tone={task.status === 'done' ? 'green' : task.status === 'in_progress' ? 'amber' : 'neutral'}>{task.status.replace('_', ' ')}</Badge></div>; }

function AuthScreen({ mode, setMode, form, setForm, onSubmit, loading, error }: { mode: 'login' | 'register'; setMode: (mode: 'login' | 'register') => void; form: { name: string; email: string; password: string }; setForm: (form: { name: string; email: string; password: string }) => void; onSubmit: (event: React.FormEvent) => void; loading: boolean; error: string }) { return <main className="auth-shell"><div className="auth-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-copy"><div className="brand"><div className="brand-mark">◒</div><span>orbit</span><span className="brand-pill">ISSUES</span></div><h1>Make the work<br /><em>visible.</em></h1><p>A calm command center for teams turning loose ends into forward motion.</p><div className="art-stat"><span>●</span><div><strong>Workspace signal</strong><small>Everything important, in one view.</small></div></div></div></div><section className="auth-card"><div className="auth-card-inner"><div className="mobile-brand brand"><div className="brand-mark">◒</div><span>orbit</span></div><p className="eyebrow">{mode === 'login' ? 'Welcome back' : 'Start a workspace'}</p><h2>{mode === 'login' ? 'Sign in to Orbit' : 'Create your account'}</h2><p className="auth-subtitle">{mode === 'login' ? 'Pick up where your team left off.' : 'Your team workspace will be ready in seconds.'}</p>{error && <div className="alert auth-alert">{error}</div>}<form className="auth-form" onSubmit={onSubmit}>{mode === 'register' && <label>Your name<Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Alex Morgan" required /></label>}<label>Email address<Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@company.com" required /></label><label>Password<Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" minLength={8} required /></label><Button type="submit" className="auth-submit" disabled={loading}>{loading ? <LoaderCircle size={17} className="spin" /> : null}{mode === 'login' ? 'Sign in' : 'Create account'}</Button></form><div className="auth-switch">{mode === 'login' ? 'New to Orbit?' : 'Already have an account?'} <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></div></div></section></main>; }
