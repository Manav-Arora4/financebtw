# FinanceBtw 💹

**AI-powered financial research assistant** — built on RAG, AI agents, hybrid search, and live market data.

> **Current phase:** `feature/project-setup` (Phase 1 of 20)

---

## Architecture

```
User Query
    │
    ▼
React Frontend (Vite + TypeScript)
    │  HTTP / WebSocket
    ▼
FastAPI Backend
    ├── AI Agent (Phase 10)
    │   ├── RAG Pipeline (Phases 5–8)
    │   └── LLM Interface (Phase 9)
    │
    └── Market Provider Interface  ←── Core abstraction
            ├── YahooFinanceProvider  (prices, history, ratios)
            ├── NSEProvider           (nsepython — indices, corporate actions)
            ├── BSEProvider           (bsedata — BSE metadata)
            └── TheNewsAPIProvider   (financial news)
```

The backend is **market-agnostic**. Switching or adding data providers is a single config change with zero core logic changes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.12 (async) |
| Frontend | React 19 + TypeScript + Vite |
| Database | PostgreSQL 16 (async via SQLAlchemy 2.x) |
| Cache | Redis 7 |
| Vector DB | Qdrant |
| Market Data | Yahoo Finance, NSE (nsepython), TheNewsAPI |
| LLM | Groq / Gemini / Ollama / OpenAI / Anthropic |
| Reverse Proxy | Nginx |
| Containers | Docker + Docker Compose |

---

## Quickstart (Docker)

```bash
# 1. Clone
git clone https://github.com/yourname/financebtw.git
cd financebtw

# 2. Configure
cp .env.example .env
# Edit .env — add your API keys (Groq + TheNewsAPI at minimum)

# 3. Run everything
docker compose -f docker/docker-compose.yml up --build

# 4. Open
# API docs:  http://localhost/api/docs
# Frontend:  http://localhost/
# Health:    http://localhost/api/v1/health
```

---

## Local Development (without Docker)

### Prerequisites
- Python 3.12+
- Node 20+
- PostgreSQL 16 (or use Docker for infra only)
- Redis 7 (or use Docker)

### Backend

```bash
# Create virtualenv and install deps
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -e ".[dev]"

# Copy and configure env
cp .env.example .env

# Run dev server
uvicorn backend.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                    # starts at http://localhost:5173
```

### Run Tests

```bash
pytest tests/ -v --asyncio-mode=auto
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. The minimum required to start:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL async DSN |
| `JWT_SECRET_KEY` | ✅ | Min 32-char random secret |
| `GROQ_API_KEY` | Recommended | Free at [console.groq.com](https://console.groq.com) |
| `THE_NEWS_API_KEY` | Recommended | Free at [thenewsapi.com](https://www.thenewsapi.com) |

---

## Development Roadmap

| Phase | Branch | Status |
|-------|--------|--------|
| 1 — Repository Foundation | `feature/project-setup` | 🔄 In Progress |
| 2 — Authentication | `feature/authentication` | ⏳ |
| 3 — Frontend Layout | `feature/frontend-layout` | ⏳ |
| 4 — Document Pipeline | `feature/document-ingestion` | ⏳ |
| 5 — Chunking | `feature/chunking` | ⏳ |
| 6 — Embeddings (BGE-M3) | `feature/embeddings` | ⏳ |
| 7 — Retriever (BM25 + Vector) | `feature/retriever` | ⏳ |
| 8 — Reranker (Cross-Encoder) | `feature/reranker` | ⏳ |
| 9 — LLM Interface | `feature/llm-interface` | ⏳ |
| 10 — AI Agent | `feature/agent` | ⏳ |
| 11 — Market APIs | `feature/market-api` | ⏳ |
| 12–20 — ... | ... | ⏳ |

---

## Contributing

1. Branch from `develop`: `git checkout -b feature/your-feature`
2. Write tests first
3. `pre-commit run --all-files` before committing
4. Open a PR against `develop` — CI must be green

---

## License

MIT
