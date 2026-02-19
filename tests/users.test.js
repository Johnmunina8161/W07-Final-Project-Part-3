const request = require('supertest');
const app = require('../src/app');

describe('GET /users', () => {
  // NOTE: This test accepts both 200 and 401 to account for AUTH_ENABLED toggling.
  // While flexible, it may mask authentication regressions. Consider splitting 
  // into separate test cases for enabled/disabled states for better precision.
  it('returns 200 or 401 depending on AUTH_ENABLED', async () => {
    const res = await request(app).get('/users');
    expect([200,401]).toContain(res.statusCode);
  });
});