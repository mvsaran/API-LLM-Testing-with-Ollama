import { test, expect } from '@playwright/test';
import { OllamaClient } from '../../clients/ollamaClient';
import { JsonSchemaValidator, UserResponseSchema } from '../../validators/jsonSchemaValidator';
import { SystemPrompts } from '../../prompts/systemPrompts';
import { TestPrompts } from '../../prompts/testPrompts';

test.describe('LLM Structured Output Tests', () => {
  let ollamaClient: OllamaClient;

  test.beforeAll(() => {
    ollamaClient = new OllamaClient();
  });

  test('Extract User Info - Valid JSON Schema', async () => {
    test.setTimeout(120000); // LLMs can be slow locally
    
    const prompt = TestPrompts.EXTRACT_USER_INFO;
    
    // Using soft mode validator for the retry loop
    const isValid = (data: string) => {
       const parsed = JsonSchemaValidator.parseJsonSafe(data);
       if (!parsed) return false;
       return JsonSchemaValidator.validate(UserResponseSchema, parsed, false).success;
    };

    const responseString = await ollamaClient.generateWithRetry(prompt, isValid, 3, {
      systemPrompt: SystemPrompts.JSON_MODE_ONLY,
    });

    const data = JSON.parse(responseString);
    
    // SDET Assertion on the AI Output
    expect(data.name).toContain('John Doe');
    expect(data.email).toBe('john.doe@example.com');
    expect(data.username).toBe('jdoe99');
  });
});
