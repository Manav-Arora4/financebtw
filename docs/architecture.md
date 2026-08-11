# FinanceBtw — Architecture & Technical Design Document

## 1. Executive Summary

**FinanceBtw** is an open-source, production-quality AI research assistant tailored for the Indian and global financial markets. It combines **Retrieval-Augmented Generation (RAG)**, **autonomous AI agents**, **hybrid search (dense vector + sparse BM25)**, and **real-time financial market data providers**.

The core system is strictly **market-agnostic**. Market-specific data sources and regulations are isolated inside a pluggable provider interface layer, allowing developers to add new exchanges (e.g. US markets, crypto) with zero modifications to the core RAG or agent reasoning workflows.

---

## 2. System Architecture

```
                               ┌────────────────────────────────┐
                               │   React Frontend (TypeScript)  │
                               │    Vite • Dashboard • Chat     │
                               └──────────────┬─────────────────┘
                                              │ HTTP / WebSocket
                               ┌──────────────▼─────────────────┐
                               │       FastAPI Application      │
                               │   Lifespan • CORS • Routing    │
                               └──────────────┬─────────────────┘
                                              │
                ┌─────────────────────────────┴─────────────────────────────┐
                │                                                           │
 ┌──────────────▼──────────────┐                             ┌──────────────▼──────────────┐
 │    Autonomous AI Agent      │                             │   Market Provider Layer     │
 │  Tool Calling • Reasoning   │                             │  Abstract MarketProvider    │
 └──────────────┬──────────────┘                             └──────────────┬──────────────┘
                │                                                           │
 ┌──────────────▼──────────────┐                             ┌──────────────▼──────────────┐
 │     Hybrid RAG Engine       │                             │      Concrete Providers     │
 │  • Dense: BGE-M3 (Qdrant)   │                             │  • YahooFinanceProvider     │
 │  • Sparse: BM25             │                             │  • NSEProvider (nsepython)  │
 │  • Cross-Encoder Reranker   │                             │  • TheNewsAPIProvider       │
 │  • Vector Database (Qdrant) │                             │  • BSEProvider (bsedata)    │
 └─────────────────────────────┘                             └─────────────────────────────┘
```

---

## 3. Market Provider Abstraction Protocol

### Problem
Traditional financial applications hardcode broker APIs (e.g. Upstox, Zerodha, Angel One) directly into their business logic. This requires users to open demat accounts, complete KYC, and tightly couples the application to specific broker APIs.

### Solution: Abstract `MarketProvider`
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

## 4. Technology Stack Justification

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Backend API** | FastAPI + Python 3.12 | Native async performance, automatic OpenAPI documentation, strict Pydantic v2 validation. |
| **Market Quotes & History** | `yfinance` 1.5+ | Completely free, no KYC/demat required, reliable OHLCV and fundamentals for `.NS`, `.BO`, and US equities. |
| **NSE Data & Indices** | `nsepython` | Direct REST API integration with NSE India for Nifty indices, corporate filings, FII/DII flows. |
| **Financial News** | TheNewsAPI | Curated financial news with country/category filtering and article provenance. |
| **Database** | PostgreSQL 16 + asyncpg | Production relational store for user auth, portfolios, and chat sessions. |
| **Caching** | Redis 7 | Sub-millisecond caching for market quotes and rate-limiting. |
| **Vector DB** | Qdrant | Fast vector search with payload filtering for financial filings. |
| **Frontend** | React 19 + TypeScript + Vite | Modern, strongly typed, modular UI. |

---

## 5. Security & Provenance Rules

1. **No Hallucinated Financials**: Every numeric statement returned by the agent must be sourced from a live provider or indexed document.
2. **Provenance Citations**: All `StockQuote`, `CompanyInfo`, `FinancialRatios`, and `NewsArticle` dataclasses include `source` and `fetched_at` (ISO-8601 UTC) fields.
3. **Secret Isolation**: Secrets reside in `.env` (gitignored). `.env.example` provides safe templates.

---

*FinanceBtw Architecture Document — Phase 1*
