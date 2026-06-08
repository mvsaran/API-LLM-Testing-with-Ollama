import { z } from 'zod';
import { JsonSchemaValidator, ToolCallSchema } from './jsonSchemaValidator';
import { logger } from '../utils/logger';

export class ToolCallValidator {
  
  static validateToolCall(jsonString: string, expectedToolName: string, expectedArgsSchema: z.ZodType<any>): boolean {
    const data = JsonSchemaValidator.parseJsonSafe(jsonString);
    if (!data) return false;

    // Validate the basic outer envelope {"tool": "...", "arguments": {...}}
    const envelopeResult = JsonSchemaValidator.validate(ToolCallSchema, data, false);
    if (!envelopeResult.success || !envelopeResult.data) {
      logger.error('Tool call envelope validation failed');
      return false;
    }

    if (envelopeResult.data.tool !== expectedToolName) {
      logger.error(`Expected tool name '${expectedToolName}', got '${envelopeResult.data.tool}'`);
      return false;
    }

    // Validate the inner arguments
    const argsResult = JsonSchemaValidator.validate(expectedArgsSchema, envelopeResult.data.arguments, false);
    if (!argsResult.success) {
      logger.error(`Tool arguments schema validation failed for tool '${expectedToolName}'`);
      return false;
    }

    return true;
  }
}
