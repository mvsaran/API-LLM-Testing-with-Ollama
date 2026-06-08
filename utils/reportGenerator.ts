import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class AICustomReporter implements Reporter {
  private apiTestsPassed = 0;
  private apiTestsTotal = 0;
  
  private llmTestsPassed = 0;
  private llmTestsTotal = 0;
  
  private toolCallPassed = 0;
  private toolCallTotal = 0;
  
  private edgeCasesFailed = 0; // Means hallucination/injection succeeded (which is bad)
  private edgeCasesTotal = 0;

  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const isPassed = result.status === 'passed';
    
    if (test.titlePath().some(p => p.includes('api-tests'))) {
      this.apiTestsTotal++;
      if (isPassed) this.apiTestsPassed++;
    } else if (test.titlePath().some(p => p.includes('llm-tests'))) {
      this.llmTestsTotal++;
      if (isPassed) this.llmTestsPassed++;
      
      // Specifically track tool calling
      if (test.title.toLowerCase().includes('tool call') || test.titlePath().some(p => p.includes('tool-calling'))) {
        this.toolCallTotal++;
        if (isPassed) this.toolCallPassed++;
      }
    } else if (test.titlePath().some(p => p.includes('edge-cases'))) {
      this.edgeCasesTotal++;
      if (isPassed) {
        // If it passed, the system handled the edge case correctly
      } else {
        this.edgeCasesFailed++;
      }
    }
  }

  onEnd(result: FullResult) {
    console.log(`\n=========================================`);
    console.log(`         AI FRAMEWORK TEST SUMMARY       `);
    console.log(`=========================================`);
    console.log(`API Tests Passed: ${this.apiTestsPassed}/${this.apiTestsTotal}`);
    console.log(`LLM Tests Passed: ${this.llmTestsPassed}/${this.llmTestsTotal}`);
    
    const toolAccuracy = this.toolCallTotal > 0 ? ((this.toolCallPassed / this.toolCallTotal) * 100).toFixed(2) : 'N/A';
    console.log(`Tool Call Accuracy: ${toolAccuracy}%`);
    
    const hallucinationRate = this.edgeCasesTotal > 0 ? ((this.edgeCasesFailed / this.edgeCasesTotal) * 100).toFixed(2) : 'N/A';
    console.log(`Hallucination / Failure Rate: ${hallucinationRate}%`);
    
    // Calculate a rough "AI Quality Score"
    let aiQualityScore = 0;
    if (this.llmTestsTotal > 0) {
      aiQualityScore = (this.llmTestsPassed / this.llmTestsTotal) * 100;
      if (this.edgeCasesTotal > 0) {
        aiQualityScore -= (this.edgeCasesFailed / this.edgeCasesTotal) * 20; // Penalize for edge case failures
      }
    }
    
    console.log(`Overall AI Quality Score: ${Math.max(0, aiQualityScore).toFixed(2)}/100`);
    console.log(`=========================================\n`);

    // Write to a summary JSON file
    const reportDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
    
    fs.writeFileSync(
      path.join(reportDir, 'ai-summary.json'),
      JSON.stringify({
        apiTests: { passed: this.apiTestsPassed, total: this.apiTestsTotal },
        llmTests: { passed: this.llmTestsPassed, total: this.llmTestsTotal },
        toolAccuracy,
        hallucinationRate,
        aiQualityScore: Math.max(0, aiQualityScore).toFixed(2)
      }, null, 2)
    );
  }
}

export default AICustomReporter;
