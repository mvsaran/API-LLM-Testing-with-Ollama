import ollama from 'ollama';
import { logger } from '../utils/logger';

export interface PromptOptions {
  model?: string;
  systemPrompt?: string;
  jsonMode?: boolean;
  temperature?: number;
}

export class OllamaClient {
  private defaultModel = process.env.OLLAMA_MODEL || 'llama3'; // Changed to llama3 to match installed local model

  async generateResponse(prompt: string, options?: PromptOptions): Promise<string> {
    const modelToUse = options?.model || this.defaultModel;
    const format = options?.jsonMode ? 'json' as const : undefined;

    const messages = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      logger.info(`Sending prompt to Ollama model ${modelToUse}...`);
      const response = await ollama.chat({
        model: modelToUse,
        messages: messages,
        format: format,
        options: {
          temperature: options?.temperature ?? 0.0, // Default to 0 for more deterministic testing
        }
      });
      return response.message.content;
    } catch (error) {
      logger.error('Error communicating with Ollama:', error);
      throw error;
    }
  }

  // Helper with retry logic specifically for structured JSON outputs
  async generateWithRetry(prompt: string, validator: (data: string) => boolean, maxRetries = 3, options?: PromptOptions): Promise<string> {
    let attempt = 0;
    while (attempt < maxRetries) {
      attempt++;
      const response = await this.generateResponse(prompt, { ...options, jsonMode: true });
      if (validator(response)) {
        return response;
      }
      logger.warn(`Attempt ${attempt} failed validation. Retrying...`);
      // Could append the validation error to the prompt here to help the LLM correct itself
    }
    throw new Error(`Failed to generate valid response after ${maxRetries} attempts.`);
  }
}
