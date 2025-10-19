const request = require('supertest');
const app = require('../src/app');

describe('GET /events', () => {
  it('returns 200 and an array', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
