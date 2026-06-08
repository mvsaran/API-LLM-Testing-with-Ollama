import { z } from 'zod';
import { logger } from '../utils/logger';

export class JsonSchemaValidator {
  
  static validate<T>(schema: z.ZodType<T>, data: unknown, strict = true): { success: boolean; data?: T; error?: any } {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      logger.error('JSON Schema validation failed:', result.error.issues);
      if (strict) {
        throw new Error(`Schema validation failed: ${JSON.stringify(result.error.issues)}`);
      }
      return { success: false, error: result.error.issues };
    }
  }

  static parseJsonSafe(jsonString: string): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      logger.error('Failed to parse string to JSON', { jsonString });
      return null;
    }
  }
}

// Example Schemas
export const UserResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  username: z.string()
});

export const ToolCallSchema = z.object({
  tool: z.string(),
  arguments: z.record(z.string(), z.any())
});
