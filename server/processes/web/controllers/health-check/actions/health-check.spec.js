'use strict';

const request = require('supertest');
const createApp = require('../../../index');

describe('Health check', function() {
  it('should respond with success', async function() {
    const response = await request(createApp().listen())
      .get('/healthcheck')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).to.eql({ success: true });
  });
});
