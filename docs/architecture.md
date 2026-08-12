# FinanceBtw -- Architecture & Technical Design Document

```
  _____ _                              ____  _          
 |  ___(_)_ __   __ _ _ __   ___ ___  | __ )| |_ __      __
 | |_  | | '_ \ / _` | '_ \ / __/ _ \ |  _ \| __\ \ /\ / /
 |  _| | | | | | (_| | | | | (_|  __/ | |_) | |_ \ V  V / 
 |_|   |_|_| |_|\__,_|_| |_|\___\___| |____/ \__| \_/\_/  
```

## 1. Executive Summary

**FinanceBtw** is an open-source, production-grade AI financial research assistant for Indian and global financial markets. It combines **LangGraph** (autonomous multi-step reasoning agents), **LlamaIndex** (end-to-end financial RAG), **LiteLLM** (provider-agnostic model gateway), **local AI embeddings/reranking (BGE-M3 + BGE-Reranker-Large)**, and an abstract **Market Data Provider** layer.

The core system is strictly **market-agnostic**. Market-specific data sources and regulations are isolated inside a pluggable provider interface layer, allowing developers to add new exchanges with zero modifications to core agent reasoning workflows.

---

## 2. System Architecture

```
                               +--------------------------------+
                               |   React Frontend (TypeScript)  |
                               |    Vite | Dashboard | Chat     |
                               +---------------+----------------+
                                               | HTTP / WebSocket
                               +---------------v----------------+
                               |       FastAPI Application      |
                               |   Lifespan | CORS | Routing    |
                               +---------------+----------------+
                                               |
                +------------------------------+------------------------------+
                |                                                             |
 +--------------v---------------+                              +--------------v---------------+
 |    LangGraph AI Agent        |                              |   Market Provider Layer      |
 |  State Graph | Tool Calling  |                              |  Abstract MarketProvider     |
 +--------------+---------------+                              +--------------+---------------+
                |                                                             |
 +--------------v---------------+                              +--------------v---------------+
 |    LlamaIndex RAG Engine     |                              |      Concrete Providers      |
 |  + Dense: BGE-M3 (Qdrant)    |                              |  + YahooFinanceProvider      |
 |  + Sparse: BM25              |                              |  + NSEProvider (nsepython)   |
 |  + BGE-Reranker-Large        |                              |  + TheNewsAPIProvider        |
 |  + Vector Database (Qdrant)  |                              |  + BSEProvider (bsedata)     |
 +--------------+---------------+                              +------------------------------+
                |
 +--------------v---------------+
 |       LiteLLM Gateway        |
 |  (Groq / OpenAI / Anthropic) |
 +------------------------------+
```

---

## 3. End-to-End Retrieval & Execution Flow

```
User Query
    |
    v
LangGraph Planner
    |
    v
Intent Detection
    |
    v
Tool Selection
    |
    v
LlamaIndex Query Engine
    |
    v
Hybrid Retrieval
    +-- Dense Vector Search (Qdrant)
    +-- BM25 Lexical Search
    +-- Metadata Filtering
    +-- Reciprocal Rank Fusion (RRF)
    |
    v
Cross Encoder Reranker (BAAI/bge-reranker-large)
    |
    v
Context Assembly
    |
    v
LiteLLM Gateway (Groq: GPT-OSS 120B / Llama 3.3)
    |
    v
Citation Validation & Guardrails
    |
    v
Final Cited Response
```

---

## 4. AI Framework Responsibilities

### A. LangGraph (Agent Orchestrator)
- Multi-step reasoning and goal-oriented planning.
- State management and conditional workflow execution.
- Tool routing: LlamaIndex query engine, live market quotes, corporate event filings, financial news.
- Long-term conversation memory and PostgreSQL checkpoints.
- Error handling, timeouts, and retry policies.

### B. LlamaIndex (RAG Framework)
- Document ingestion (PDFs, earnings transcripts, SEBI circulars, annual reports).
- Tabular financial data preservation during semantic chunking.
- Hierarchical node parsing and metadata extraction (ticker, date, category).
- Indexing into Qdrant vector database.
- Citation tracking linking extracted statements to exact document pages.

### C. LiteLLM (Universal LLM Abstraction)
- Single, consistent API interface for all LLM calls.
- Default provider: **Groq** (model: `gpt-oss-120b` / `llama-3.3-70b-versatile`).
- Switchable to OpenAI, Anthropic, Gemini, OpenRouter, or Ollama via environment variables.
- Native streaming, tool calling, and structured JSON output schema validation.

### D. Local AI Models (Zero Embedding API Cost)
- **Embedding Model**: `BAAI/bge-m3` (dense 1024-dim representations + sparse vectors).
- **Reranker**: `BAAI/bge-reranker-large` (cross-encoder for semantic relevance scoring).
- Zero remote API calls for embeddings to guarantee privacy, deterministic results, and zero API costs.

---

## 5. Market Provider Abstraction Protocol

### Abstract `MarketProvider`
FinanceBtw introduces an abstract base class `MarketProvider` in `backend/market/base.py`. Every provider implements standard contracts:

```python
class MarketProvider(ABC):
    async def get_stock_quote(self, symbol: str) -> StockQuote: ...
    async def get_company_info(self, symbol: str) -> CompanyInfo: ...
    async def get_financial_ratios(self, symbol: str) -> FinancialRatios: ...
    async def get_historical_prices(self, symbol: str, start: date, end: date, interval: str) -> HistoricalPrices: ...
    async def search_company(self, query: str, limit: int) -> list[SearchResult]: ...
    async def get_news(self, query: str, limit: int, locale: str) -> list[NewsArticle]: ...
```

### Provider Registry
At runtime, providers are registered into `ProviderRegistry`:
- `quotes`: `YahooFinanceProvider` (Fast quotes, OHLCV history, valuation ratios)
- `indices`: `NSEProvider` (NSE REST APIs, index levels, corporate events)
- `news`: `TheNewsAPIProvider` (Filtered business news stream)
- `bse`: `BSEProvider` (BSE metadata)

---

## 6. Security & Guardrail Rules

1. **No Hallucinated Financials**: The agent must never answer factual financial questions from model weights alone.
2. **Mandatory Citations**: Every factual statement must cite its live API provider or ingested document source.
3. **Prompt Injection Immunity**: Uploaded financial documents are treated as untrusted data inputs and never executed as agent instructions.
4. **Non-Advisory Mandate**: All analysis is flagged as educational research, not registered investment advice.
