const request = require('supertest');
const { app, server } = require('../backend/server'); // Import server for closing after tests
import '@testing-library/jest-dom';

describe('POST /api/prompt', () => {
  it('should return a response for a valid prompt', async () => {
    const response = await request(app)
      .post('/api/prompt')
      .send({ prompt: 'Hello, chatbot!' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.response).toBeDefined();
    expect(response.body.response).not.toBe('');
  });

  it('should return an error for an invalid prompt', async () => {
    const response = await request(app)
      .post('/api/prompt')
      .send({ prompt: '' })
      .expect(400);

    expect(response.body.error).toBe('Prompt is required');
  });
});

// Ensure the server is closed after tests are done
afterAll(() => {
  server.close();  // Close the server properly after the tests
});
