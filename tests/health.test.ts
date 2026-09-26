import request from 'supertest';
import { createApp } from '../src/app';
import { resetStores } from '../src/data/store';

afterEach(() => resetStores());

describe('API health', () => {
  it('returns service status', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });

  it('creates an owned workspace during registration and isolates it between users', async () => {
    const app = createApp();
    const firstUser = await request(app).post('/api/auth/register').send({
      email: 'first@example.com',
      password: 'password123',
      name: 'First User',
    });
    const secondUser = await request(app).post('/api/auth/register').send({
      email: 'second@example.com',
      password: 'password123',
      name: 'Second User',
    });

    expect(firstUser.status).toBe(201);
    expect(firstUser.body.data.workspace.ownerId).toBe(firstUser.body.data.user.id);

    const firstWorkspaces = await request(app)
      .get('/api/workspaces')
      .set('Authorization', `Bearer ${firstUser.body.data.token}`);
    const secondWorkspaces = await request(app)
      .get('/api/workspaces')
      .set('Authorization', `Bearer ${secondUser.body.data.token}`);

    expect(firstWorkspaces.body.data.workspaces).toHaveLength(1);
    expect(secondWorkspaces.body.data.workspaces).toHaveLength(1);
    expect(firstWorkspaces.body.data.workspaces[0].id).not.toBe(secondWorkspaces.body.data.workspaces[0].id);
  });
});
