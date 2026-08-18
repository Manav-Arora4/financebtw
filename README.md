```
  _____ _                              ____  _          
 |  ___(_)_ __   __ _ _ __   ___ ___  | __ )| |_ __      __
 | |_  | | '_ \ / _` | '_ \ / __/ _ \ |  _ \| __\ \ /\ / /
 |  _| | | | | | (_| | | | | (_|  __/ | |_) | |_ \ V  V / 
 |_|   |_|_| |_|\__,_|_| |_|\___\___| |____/ \__| \_/\_/  
```

# FinanceBtw

**Institutional-grade AI financial research workstation and market terminal** for Indian and global equities — built with LangGraph, LlamaIndex, local zero-cost embeddings (BGE-M3), provider-agnostic market data pipelines, and a high-density Bloomberg/Linear-inspired dark UI.

> **Current Phase:** **UI Phase 4 — Research Copilot** & **Backend Phase 4 — Document Ingestion & Local Embeddings (BGE-M3)**  
> **Active Branch:** `feature/ui-redesign`

---

## 🏛 System Architecture

```
User Query / Interactions
    │
    ▼
React 19 Workstation Frontend (TypeScript + Vite + Zustand)
    │  HTTP / WebSocket / SSE
    ▼
FastAPI Backend Gateway
    ├── Auth & Security (Supabase JWT / PostgreSQL User Sync)
    ├── LangGraph Agent Orchestrator (Multi-step reasoning & tool execution)
    │   ├── LlamaIndex Financial RAG Pipeline (BGE-M3 + BM25 + BGE-Reranker-Large)
    │   └── LiteLLM Model Gateway (Groq / Gemini / Ollama / OpenAI / Anthropic)
    └── Pluggable Market Provider Registry
            ├── YahooFinanceProvider  (Quotes, OHLCV historicals, financial ratios)
            ├── NSEProvider           (Live NSE indices, corporate actions, filings)
            ├── BSEProvider           (BSE metadata & company records)
            └── TheNewsAPIProvider    (Filtered financial news & sentiment)
```

The backend is strictly **market-agnostic**. Switching or adding data providers is a single configuration change with zero core logic changes.

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Zustand, React Router 7 |
| **Styling & UI** | Vanilla CSS Design Token System, Glassmorphic Dark Workstation Theme |
| **Backend** | FastAPI, Python 3.12+ (async), Pydantic v2 |
| **Database** | PostgreSQL 16 (Async SQLAlchemy 2.x ORM) |
| **Caching** | Redis 7 |
| **Vector Store** | Qdrant |
| **Embeddings & Reranker** | `BAAI/bge-m3` (Local 1024-dim dense + sparse) & `BAAI/bge-reranker-large` |
| **LLM Gateway** | LiteLLM (Groq `llama-3.3-70b-versatile` / `gpt-oss-120b`, Gemini, Ollama) |
| **Market Data** | Yahoo Finance (`yfinance`), NSE (`nsepython`), BSE, TheNewsAPI |
| **Containers & CI** | Docker, Docker Compose, GitHub Actions |

---

## 🚀 Quickstart (Docker)

```bash
# 1. Clone
git clone https://github.com/Manav-Arora4/financebtw.git
cd financebtw

# 2. Configure
cp .env.example .env
# Edit .env -- add your API keys (Groq + TheNewsAPI at minimum)

# 3. Run everything
docker compose -f docker/docker-compose.yml up --build

# 4. Access Services
# Frontend Terminal: http://localhost:5173 (or http://localhost/)
# FastAPI Docs:      http://localhost:8000/api/docs (or http://localhost/api/docs)
# Health Check:      http://localhost:8000/api/v1/health
```

---

## 💻 Local Development (Without Docker)

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16 & Redis 7 (or run via Docker)

### Backend Setup

```bash
# Create virtualenv and install dependencies
python -m venv .venv
.venv\Scripts\activate          # Windows (or: source .venv/bin/activate on macOS/Linux)
pip install -e ".[dev]"

# Configure environment
cp .env.example .env

# Run FastAPI backend server
uvicorn backend.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev                     # Starts Vite dev server at http://localhost:5173
```

### Running Test & Verification Suite

```bash
# Backend unit & integration tests (54 tests, >85% coverage)
python -m pytest tests/ -v

# Backend linting & type checks
python -m ruff check backend/ tests/
python -m mypy backend/

# Frontend production build & lint
cd frontend
npm run build
npm run lint
```

---

## 🗺 Roadmap & Progress (Synchronized Full-Stack Milestones)

Development proceeds in **synchronized full-stack milestones** where the Frontend UI Workstation is constructed first, immediately followed by its corresponding Backend Engine, APIs, and AI Pipelines:

| Milestone | Frontend UI Phase | Backend & AI Phase | Status | Scope & Deliverables |
|:---:|---|---|:---:|---|
| **M-1** | **UI-1: Design System & Tokens** | **BE-1: FastAPI Foundation & Redis** | ✅ **DONE** | Complete HSL token system, typography scale (`13.5px` base), cards, modals, async FastAPI, SQLAlchemy 2.0, Redis cache, Docker Compose. |
| **M-2** | **UI-2: Global Workstation Shell** | **BE-2: Supabase Auth & RBAC** | ✅ **DONE** | Benchmark ticker ribbon, global navigation, collapsible sidebar, `Ctrl+K` palette, Supabase JWT verification, user sync. |
| **M-3** | **UI-3: Company Dashboard & Selector** | **BE-3: Market Provider & REST API** | ✅ **DONE** | Company search/selector launcher, tracked securities toolbar, real live quotes, real OHLCV chart, live ratios, and `/api/v1/market` endpoints. |
| **M-4** | **UI-4: Research Copilot (`/research`)** | **BE-4: Local Embeddings (BGE-M3) & Qdrant**<br>**BE-5: LiteLLM & LangGraph Agent** | 🔄 **IN PROGRESS** | **UI (✅ DONE)**: 3-panel research workspace, multi-step reasoning steps, inline citations `[1]`, tool traces, DuPont tables, context inspector.<br>**BE (Active)**: Local `BAAI/bge-m3` dense + sparse vectors, Qdrant indexing, LangGraph StateGraph agent, LiteLLM gateway, SSE streaming API. |
| **M-5** | **UI-5: Research Hub & Document Viewer** | **BE-6: Financial Ingestion & PDF Parser** | ⏳ UP NEXT | Interactive PDF reader, filing search repository, table-aware chunker for annual reports, investor presentations, and SEBI disclosures. |
| **M-6** | **UI-6: Markets Hub (`/markets`)** | **BE-7: Market Breadth & Sector Engine** | ⏳ QUEUED | Macro indices overview, Sector Heatmap, Market Breadth (Advancers vs Decliners), 52W range extremes, India VIX gauge. |
| **M-7** | **UI-7: Advanced Screener (`/screener`)** | **BE-8: Multi-Factor Screener Engine** | ⏳ QUEUED | 2,000+ NSE/BSE stock screener with multi-factor filters (P/E, P/B, ROE %, ROCE %, Debt/Equity) and preset institutional strategies. |
| **M-8** | **UI-8: Portfolio Analytics (`/portfolio`)** | **BE-9: Portfolio Performance Service** | ⏳ QUEUED | Demat import/trade logging, Realized/Unrealized P&L, Sector allocation donut, benchmark alpha/beta regression vs NIFTY 50. |
| **M-9** | **UI-9: Watchlists (`/watchlists`)** | **BE-10: Watchlist Storage & Live Sync** | ⏳ QUEUED | Multi-watchlist manager, mini SVG sparklines, custom column configurator, PostgreSQL relational store, CSV export. |
| **M-10**| **UI-10: Alerts & Signals (`/alerts`)** | **BE-11: Real-Time Trigger & SEBI Cron** | ⏳ QUEUED | Custom price threshold triggers, exchange filing alerts, background event monitor, in-app notification center. |
| **M-11**| **UI-11: News Terminal (`/news`)** | **BE-12: News Stream & Sentiment Engine** | ⏳ QUEUED | Live breaking news wire with sentiment tagging (Bullish / Neutral / Bearish), ticker filter pills, source filtering (Reuters, ET). |
| **M-12**| **UI-12: Financial Modeler & Settings** | **BE-13: Quantitative Engine (DCF/DuPont)**<br>**BE-14: Production Hardening & Telemetry** | ⏳ QUEUED | DCF sensitivity matrix, 5-stage DuPont ROE breakdown, settings, rate limiting, token cost tracking, OpenTelemetry, Prometheus metrics. |

---

---

## 🔒 Security & Guardrails

1. **No Hallucinated Financials**: The agent is strictly constrained to cite live market data or ingested financial documents for factual claims.
2. **Local AI Privacy**: Embeddings and reranking run locally to ensure private financial documents are never transmitted to third-party embedding endpoints.
3. **Non-Advisory Mandate**: All outputs are structured for research and educational purposes, adhering to financial regulatory disclosures.

---

## 📄 License

MIT License. Designed and built for institutional-grade financial intelligence.
