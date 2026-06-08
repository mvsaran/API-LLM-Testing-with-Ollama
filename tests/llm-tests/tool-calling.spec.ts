import { test, expect } from '@playwright/test';
import { OllamaClient } from '../../clients/ollamaClient';
import { ToolCallValidator } from '../../validators/toolCallValidator';
import { SystemPrompts } from '../../prompts/systemPrompts';
import { TestPrompts } from '../../prompts/testPrompts';
import { z } from 'zod';

test.describe('LLM Tool Calling Tests', () => {
  let ollamaClient: OllamaClient;

  test.beforeAll(() => {
    ollamaClient = new OllamaClient();
  });

  test('Extract exact tool call for Get User', async () => {
    test.setTimeout(120000);
    
    const prompt = TestPrompts.GET_USER_TOOL_CALL;
    const expectedArgsSchema = z.object({ id: z.coerce.number() });

    const responseString = await ollamaClient.generateResponse(prompt, {
      systemPrompt: SystemPrompts.TOOL_CALLER,
      jsonMode: true
    });

    const isValid = ToolCallValidator.validateToolCall(responseString, 'getUser', expectedArgsSchema);
    expect(isValid).toBeTruthy();
    
    const parsed = JSON.parse(responseString);
    expect(parsed.arguments.id).toBe(10);
  });

  test('Extract exact tool call for Search Products', async () => {
    test.setTimeout(120000);
    
    const prompt = TestPrompts.SEARCH_PRODUCTS_TOOL_CALL;
    const expectedArgsSchema = z.object({ 
      category: z.string().optional(),
      maxPrice: z.coerce.number().optional()
    });

    const responseString = await ollamaClient.generateResponse(prompt, {
      systemPrompt: SystemPrompts.TOOL_CALLER,
      jsonMode: true
    });

    const isValid = ToolCallValidator.validateToolCall(responseString, 'searchProducts', expectedArgsSchema);
    expect(isValid).toBeTruthy();
    
    const parsed = JSON.parse(responseString);
    expect(parsed.arguments.maxPrice).toBeLessThanOrEqual(500);
  });
});
