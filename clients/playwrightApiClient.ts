import { APIRequestContext, expect } from '@playwright/test';

export class PlaywrightApiClient {
  constructor(private request: APIRequestContext) {}

  async get(endpoint: string, expectedStatus: number = 200) {
    const response = await this.request.get(endpoint);
    expect(response.status()).toBe(expectedStatus);
    return response.json();
  }

  async post(endpoint: string, data: any, expectedStatus: number = 201) {
    const response = await this.request.post(endpoint, {
      data
    });
    expect(response.status()).toBe(expectedStatus);
    return response.json();
  }
  
  async delete(endpoint: string, expectedStatus: number = 200) {
    const response = await this.request.delete(endpoint);
    expect(response.status()).toBe(expectedStatus);
    return response;
  }
}
