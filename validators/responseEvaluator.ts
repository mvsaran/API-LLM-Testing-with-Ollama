import { OllamaClient } from '../clients/ollamaClient';

export class ResponseEvaluator {
  private ollamaClient: OllamaClient;

  constructor() {
    this.ollamaClient = new OllamaClient();
  }

  // Example of a programmatic check (heuristic)
  static containsHallucinatedFields(responseJson: any, expectedKeys: string[]): boolean {
    const responseKeys = Object.keys(responseJson);
    return responseKeys.some(key => !expectedKeys.includes(key));
  }

  // Example of using an LLM-as-a-judge for semantic relevance
  async evaluateRelevance(prompt: string, response: string, expectedSemanticMeaning: string): Promise<boolean> {
    const evaluationPrompt = `
You are an evaluator. 
A user provided the prompt: "${prompt}"
The system generated the response: "${response}"
Does this response fulfill the expected meaning: "${expectedSemanticMeaning}"?

Reply strictly with JSON: {"isRelevant": true} or {"isRelevant": false}.
`;
    try {
       const evalResponse = await this.ollamaClient.generateResponse(evaluationPrompt, { jsonMode: true, temperature: 0 });
       const parsed = JSON.parse(evalResponse);
       return parsed.isRelevant === true;
    } catch (e) {
      return false;
    }
  }

  // Consistency check: run multiple times and see if output structure/content is stable
  async evaluateConsistency(prompt: string, iterations = 3): Promise<number> {
    const results: string[] = [];
    for (let i = 0; i < iterations; i++) {
      results.push(await this.ollamaClient.generateResponse(prompt, { temperature: 0.7 })); // slightly higher temp for testing consistency
    }
    
    // A simple heuristic for consistency (e.g., do they all parse to JSON with the same keys?)
    let validJsonCount = 0;
    for (const res of results) {
      try {
        JSON.parse(res);
        validJsonCount++;
      } catch (e) {}
    }
    
    return validJsonCount / iterations; // Score between 0 and 1
  }
}
