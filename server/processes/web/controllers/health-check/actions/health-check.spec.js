'use strict';

const request = require('supertest');
const app = require('../../../index');

describe('Health check', function() {
  it('should respond with success', async function() {
    const response = await request(app.listen())
      .get('/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.eql({ success: true });
  });
});
