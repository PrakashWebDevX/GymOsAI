import request from 'supertest';
import app from '../src/app.js';

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('GYMOS AI');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/login validates input', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register validates input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('Protected Routes', () => {
  it('GET /api/profile requires auth', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });

  it('GET /api/workout/history requires auth', async () => {
    const res = await request(app).get('/api/workout/history');
    expect(res.status).toBe(401);
  });
});

describe('404 Handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
  });
});
