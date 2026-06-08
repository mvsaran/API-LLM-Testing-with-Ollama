import { test, expect } from '@playwright/test';
import { PlaywrightApiClient } from '../../clients/playwrightApiClient';

test.describe('SDET API Contract Tests', () => {
  let apiClient: PlaywrightApiClient;

  test.beforeAll(async ({ request }) => {
    apiClient = new PlaywrightApiClient(request);
  });

  test('GET /users - Verify status and schema', async () => {
    const users = await apiClient.get('/users', 200);
    
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    
    const firstUser = users[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('name');
    expect(firstUser).toHaveProperty('email');
  });

  test('POST /users - Create new user', async () => {
    const newUser = {
      name: 'Test Automation User',
      username: 'testauto',
      email: 'test@auto.com'
    };

    const response = await apiClient.post('/users', newUser, 201);
    expect(response.id).toBeDefined();
    expect(response.name).toBe(newUser.name);
  });

  test('GET /users/99999 - Verify 404 behavior', async ({ request }) => {
    // using raw request for negative test to verify standard Playwright fallback
    const response = await request.get('/users/99999');
    expect(response.status()).toBe(404);
  });
});
