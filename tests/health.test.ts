import request from 'supertest';
import { createApp } from '../src/app';

describe('API health', () => {
  it('returns service status', async () => {
    const app = createApp();

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });
});
