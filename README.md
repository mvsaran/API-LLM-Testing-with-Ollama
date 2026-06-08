# 🧪 API & LLM Testing with Ollama
### *Hybrid Test Automation Framework — From SDET to AI Engineer*

> **Bridging the gap between deterministic API testing and probabilistic AI validation using Playwright, Zod, and local Ollama models.**

---

## 📖 Overview

As AI systems and LLMs become deeply integrated into modern software, traditional testing frameworks fall short. You cannot assert `response === "expected string"` against non-deterministic LLM generation.

This framework unifies **classical SDET contract testing** with **modern AI validation** under a single, coherent architecture — empowering QA engineers to confidently test both worlds without switching toolchains.

---

## 🚨 Problem Statement

| ⚠️ Challenge | 📝 Description |
|---|---|
| **Non-Deterministic Outputs** | LLMs generate different text on every run. Exact-match or regex assertions become brittle and cause flaky test suites. |
| **Schema Violations** | When LLMs handle Tool Calling, they may hallucinate properties, omit required fields, or return malformed JSON. |
| **Prompt Injection & Edge Cases** | AI features are uniquely vulnerable to prompt injection, context limit failures, and hallucinations that traditional tests ignore. |
| **Siloed Toolchains** | Testing APIs and AI models typically requires entirely separate frameworks, fracturing the CI/CD pipeline. |

---

## 💡 The Solution

This framework layers specialized AI validation techniques **on top of** a standard Playwright API testing suite:

- 🔁 **Unified Runner** — Playwright executes both traditional HTTP API tests and local Ollama interactions in one pipeline
- 🧩 **Structured Output Validation** — Strict Zod schemas enforce data contracts on LLM outputs, with automatic retry/self-correction on invalid JSON
- 🛠️ **Tool Calling Simulation** — Validates the LLM's ability to trigger internal application tools by checking semantic structure (e.g., `{"tool": "getUser", "arguments": {"id": 10}}`)
- 📊 **Probabilistic Heuristics** — Custom `ResponseEvaluators` check for hallucinations, consistency across repeated identical prompts, and LLM-as-a-judge semantic relevance
- 📈 **Custom AI Metrics** — Extended Playwright reporter generates `ai-summary.json` with **Tool Call Accuracy**, **Hallucination Rate**, and an overall **AI Quality Score**

---

## 🏆 Benefits

| ✅ Benefit | 💬 Details |
|---|---|
| 🧘 **Flake-Free AI Testing** | Schema validation over string matching keeps tests stable even as model wording evolves |
| 🛡️ **Security & Robustness** | Explicitly tests against prompt injection and hallucination, ensuring predictable AI behaviour in production |
| 💰 **Cost-Effective & Private** | Local models via Ollama — run thousands of CI/CD tests with zero API fees and no data leakage |
| 🎓 **SDET Upskilling** | A clear, practical path for SDETs to move into AI Engineering using familiar tools (Playwright + TypeScript) |

---

## 🧑‍💻 Why This Matters for QA Engineers

Most QA teams are now being asked to test AI features with no training, no tooling, and no playbook. This framework directly addresses that gap across every layer of a QA engineer's work.

---

### 🔵 Traditional API Testing — Enhanced

Everything you already do as an SDET, but better:

- All API and AI tests live in **one codebase** — no context-switching between Postman, RestAssured, and a separate AI tool
- Playwright's built-in **retry, parallelism, and HTML reporting** replaces a lot of manual glue code
- Zod schemas act as **living contracts** — if the API response shape changes, tests break immediately and loudly

---

### 🟣 LLM Feature Testing — Finally Solved

This is where most QA teams have **no strategy yet**. You can't write `assert response == "Hello"` because the LLM says something slightly different every single run. This framework gives you a concrete answer for every common AI testing question:

| ❓ QA Question | ✅ How the Framework Answers It |
|---|---|
| "Did the AI return valid data?" | Zod schema validation — checks **structure**, not wording |
| "Did the AI hallucinate?" | `ResponseEvaluator` automatically flags fabricated content |
| "Is the AI consistent?" | Runs the same prompt N times and compares outputs statistically |
| "Did the AI call the right function?" | Tool call validator checks exact name + argument structure |
| "Is this response actually relevant?" | LLM-as-a-judge scores semantic relevance automatically |

---

### 🔴 Edge Case & Security Testing — Out of the Box

QAs often skip AI security testing because they don't know where to start. This framework removes that barrier:

- **Prompt injection tests** are pre-written — just run them
- Catches scenarios where malicious user input hijacks the AI's behaviour
- Hallucination edge cases are pre-catalogued in `testPrompts.ts`, ready to extend

---

### 📊 Reporting That Actually Speaks to Stakeholders

Traditional test reports show pass/fail. For AI features, stakeholders need **quantified confidence**, not just green ticks.

- `ai-summary.json` gives you **measurable AI quality** across every run
- Metrics like **Hallucination Rate** and **AI Quality Score** can become part of your **Definition of Done**
- Gives QA a clear, data-backed voice when the team debates whether an AI feature is ready to ship

---

### 🎓 Career Growth for QAs

Practically speaking, this framework gives you a **concrete, runnable project** to learn and demonstrate AI testing skills — without needing to abandon your existing Playwright/TypeScript knowledge or learn an entirely new stack from scratch.

---

## 📂 Project Structure

```text
/
├── 📁 clients/
│   ├── playwrightApiClient.ts    # Wrapper for standard REST API interactions
│   └── ollamaClient.ts           # Wrapper for Ollama LLM generation w/ retry logic
│
├── 📁 prompts/
│   ├── systemPrompts.ts          # AI persona definitions (e.g. Strict JSON Mode)
│   └── testPrompts.ts            # Catalog of test inputs and injection payloads
│
├── 📁 tests/
│   ├── api-tests/                # 🔵 Traditional SDET contract tests (Status, Headers)
│   │   └── users.api.spec.ts
│   ├── llm-tests/                # 🟣 AI Engineer probabilistic & schema tests
│   │   ├── structured-output.spec.ts
│   │   └── tool-calling.spec.ts
│   └── edge-cases/               # 🔴 Prompt injection & hallucination tests
│       └── llm-edge-cases.spec.ts
│
├── 📁 utils/
│   ├── logger.ts                 # Structured console/file logger
│   └── reportGenerator.ts        # Custom Playwright reporter for AI-specific metrics
│
├── 📁 validators/
│   ├── jsonSchemaValidator.ts    # Zod schemas for user data & expected AI outputs
│   ├── responseEvaluator.ts      # LLM-as-a-judge & consistency heuristics
│   └── toolCallValidator.ts      # Verifies tool name and argument payloads
│
├── playwright.config.ts          # Playwright test runner configuration
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🧱 Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                   Playwright Test Runner                 │
│                                                          │
│  ┌──────────────────┐        ┌────────────────────────┐  │
│  │  🔵 API Tests    │        │  🟣 LLM Tests          │  │
│  │  (Deterministic) │        │  (Probabilistic)       │  │
│  │                  │        │                        │  │
│  │  REST Contract   │        │  Schema Validation     │  │
│  │  Status Codes    │        │  Tool Call Accuracy    │  │
│  │  Header Checks   │        │  Hallucination Rate    │  │
│  └────────┬─────────┘        └──────────┬─────────────┘  │
│           │                             │                 │
│           ▼                             ▼                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │          📊 Custom AI Reporter                     │  │
│  │          → test-results/ai-summary.json            │  │
│  └────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### ✅ Prerequisites

| Requirement | Details |
|---|---|
| **Node.js** | v18 or higher |
| **Ollama** | Installed locally and running (`ollama serve`) |
| **Local Model** | Default: `llama3.2` — pull with `ollama pull llama3.2` |

### 📦 Installation

```bash
npm install
npx playwright install
```

---

## ▶️ Running the Tests

### 🔵 All Tests
```bash
npm run test
```
> Runs the full suite — API contracts, LLM validation, and edge cases.

### 🔵 API Contract Tests Only
```bash
npm run test-api
```
> Traditional SDET tests: status codes, response headers, payload structure.

### 🟣 LLM / AI Tests Only
```bash
npm run test-ai
```
> Structured output validation and tool calling accuracy tests against the local Ollama model.

### 🔴 Edge Case Tests Only
```bash
npm run test-edge
```
> Prompt injection resistance, hallucination detection, and boundary condition coverage.

---

## 📊 Reporting

After each test run, a full summary is printed to the console. A persistent AI metrics file is saved at:

```
test-results/ai-summary.json
```

This file includes:

| 📐 Metric | 📝 Description |
|---|---|
| **Tool Call Accuracy** | % of tool calls where the LLM returned the correct tool name and valid arguments |
| **Hallucination Rate** | % of responses containing fabricated or out-of-scope information |
| **AI Quality Score** | Composite score derived from consistency, schema compliance, and semantic relevance |

---

## 🛣️ Roadmap

- [ ] 🌐 Remote model support (OpenAI, Anthropic APIs) with cost tracking
- [ ] 📉 Trend dashboards across CI/CD runs
- [ ] 🔌 Plugin system for custom `ResponseEvaluator` extensions
- [ ] 🐳 Docker-based Ollama environment for fully portable test runs

---

## 🤝 Contributing

Contributions are welcome! If you're an SDET exploring AI Engineering or an ML engineer who needs robust testing tooling, open a PR or file an issue.

---

## 📄 License

MIT — free to use, modify, and distribute.
