const request = require('supertest');
const app = require('../src/app');

describe('GET /users', () => {
  it('returns 200 or 401 depending on AUTH_ENABLED', async () => {
    const res = await request(app).get('/users');
    expect([200,401]).toContain(res.statusCode);
  });
});
