import request from 'supertest';
import app from '../src/app.js';

describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('GYMOS AI');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/register should validate input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalid', password: '123' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login should validate input', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/logout should require auth', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(401);
  });
});

describe('Protected Routes', () => {
  it('GET /api/profile should require auth', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });

  it('GET /api/workout/history should require auth', async () => {
    const res = await request(app).get('/api/workout/history');
    expect(res.status).toBe(401);
  });

  it('GET /api/nutrition/history should require auth', async () => {
    const res = await request(app).get('/api/nutrition/history');
    expect(res.status).toBe(401);
  });

  it('GET /api/progress should require auth', async () => {
    const res = await request(app).get('/api/progress');
    expect(res.status).toBe(401);
  });

  it('GET /api/achievements should require auth', async () => {
    const res = await request(app).get('/api/achievements');
    expect(res.status).toBe(401);
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
