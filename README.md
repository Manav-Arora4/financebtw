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

## 🗺 Roadmap & Progress

### 🖥 Frontend Workstation UI (12-Phase Roadmap)

| Phase | Module | Status | Highlights |
|:---:|---|:---:|---|
| **UI-1** | **Design System & Tokens** | ✅ **DONE** | Complete HSL token system, typography scale (`13.5px` base), cards, buttons, badges, tables, modals |
| **UI-2** | **Global Layout Shell** | ✅ **DONE** | Live market ticker ribbon, global search, collapsible sidebar, `Ctrl+K` command palette, notification stack |
| **UI-3** | **Institutional Company Dashboard** | ✅ **DONE** | Candlestick chart (`340px–460px` clamp) with drawing tools, un-squished SVG Financials, Analyst Donut Gauge, Movers, News, Portfolio Summary |
| **UI-4** | **Research Copilot (`/research`)** | 🔄 **IN PROGRESS** | Streaming token responses, inline document citations, interactive tool execution traces, structured tables |
| **UI-5** | **Markets Hub (`/markets`)** | ⏳ UP NEXT | Sector heatmaps, market breadth bar, 52-week breakouts, India VIX gauge, economic calendar |
| **UI-6** | **Advanced Screener (`/screener`)** | ⏳ QUEUED | Fundamental & technical multi-factor filtering, sticky sortable table, preset strategies |
| **UI-7** | **Portfolio Analytics (`/portfolio`)** | ⏳ QUEUED | Real-time P&L attribution, sector/asset allocation donuts, benchmark comparison vs NIFTY 50 |
| **UI-8** | **Research Hub & Docs (`/research-hub`)** | ⏳ QUEUED | Annual reports, quarterly earnings filings, SEBI disclosures, integrated PDF viewer |
| **UI-9** | **News Terminal (`/news`)** | ⏳ QUEUED | Live breaking news stream, entity tagging, source filtering (ET, LiveMint, Moneycontrol) |
| **UI-10**| **Watchlists (`/watchlists`)** | ⏳ QUEUED | Multi-list management, mini sparklines, customizable data columns |
| **UI-11**| **Alerts & Signals (`/alerts`)** | ⏳ QUEUED | Price triggers, corporate event reminders, technical breakout alerts |
| **UI-12**| **Workstation Settings (`/settings`)** | ⏳ QUEUED | Keybinding manager, theme accents, data provider configurations |

---

### ⚙ Backend & AI Core (20-Phase Roadmap)

| Phase | Module | Status | Highlights |
|:---:|---|:---:|---|
| **BE-1** | **Repository Foundation** | ✅ **DONE** | Async FastAPI, SQLAlchemy 2.0, Redis, base provider interface, Docker compose, CI/CD |
| **BE-2** | **Authentication & Security** | ✅ **DONE** | Supabase Auth integration, JWT validation, user sync endpoints, RBAC dependencies |
| **BE-3** | **Market Data Providers** | ✅ **DONE** | Yahoo Finance, NSE (`nsepython`), BSE, and TheNewsAPI provider implementations |
| **BE-4** | **Local Embeddings (BGE-M3)** | 🔄 **IN PROGRESS** | Zero-API-cost local embedding engine (`BAAI/bge-m3`) with dense 1024-dim and sparse BM25 vectors |
| **BE-5** | **Document Pipeline & Chunking** | ⏳ QUEUED | Table-aware financial document chunker for earnings reports and filings |
| **BE-6** | **Vector Store & Indexing (Qdrant)** | ⏳ QUEUED | Qdrant collection setup with payload filtering by ticker, quarter, and document type |
| **BE-7** | **Hybrid Search & Reranker** | ⏳ QUEUED | Reciprocal Rank Fusion (RRF) + `BAAI/bge-reranker-large` cross-encoder |
| **BE-8** | **LiteLLM Universal Gateway** | ⏳ QUEUED | Multi-provider LLM interface with fallback and streaming support |
| **BE-9** | **LangGraph Agent Orchestrator** | ⏳ QUEUED | StateGraph reasoning agent with dynamic tool routing and conversation memory |
| **BE-10**| **Streaming & Citations API** | ⏳ QUEUED | Server-Sent Events (SSE) streaming with strict citation validation |

---

## 🔒 Security & Guardrails

1. **No Hallucinated Financials**: The agent is strictly constrained to cite live market data or ingested financial documents for factual claims.
2. **Local AI Privacy**: Embeddings and reranking run locally to ensure private financial documents are never transmitted to third-party embedding endpoints.
3. **Non-Advisory Mandate**: All outputs are structured for research and educational purposes, adhering to financial regulatory disclosures.

---

## 📄 License

MIT License. Designed and built for institutional-grade financial intelligence.
