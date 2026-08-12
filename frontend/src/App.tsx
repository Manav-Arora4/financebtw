import React, { useEffect, useState } from 'react';
import apiClient from './api/client';
import './App.css';

interface ProviderHealth {
  provider?: string;
  status: string;
  detail?: string;
  test_symbol?: string;
  price?: number;
}

interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  python_version: string;
  providers: Record<string, ProviderHealth>;
}

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'roadmap'>('overview');

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<HealthResponse>('/api/v1/health');
      setHealth(res.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to FinanceBtw backend at http://localhost:8000'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <div className="logo-text">[FB]</div>
          <div>
            <h1 className="brand-title">FinanceBtw</h1>
            <span className="brand-subtitle">AI Research Assistant for Indian and Global Markets</span>
          </div>
        </div>
        <div className="nav-actions">
          <span className="badge badge-branch">branch: feature/project-setup</span>
          <span className={`badge ${health?.status === 'ok' ? 'badge-online' : 'badge-offline'}`}>
            [{health?.status === 'ok' ? 'ONLINE' : 'OFFLINE'}] {health?.status === 'ok' ? 'System Operational' : 'Backend Offline'}
          </span>
          <button className="btn btn-secondary" onClick={fetchHealth} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          [Architecture & Overview]
        </button>
        <button
          className={`tab-btn ${activeTab === 'providers' ? 'active' : ''}`}
          onClick={() => setActiveTab('providers')}
        >
          [Market Providers ({health ? Object.keys(health.providers).length : '4'})]
        </button>
        <button
          className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          [20-Phase Roadmap]
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="content">
        {error && (
          <div className="alert alert-warning">
            <div className="alert-header">
              <span className="alert-badge">[!]</span>
              <strong>Backend Connection Notice</strong>
            </div>
            <p>{error}</p>
            <small>
              Ensure the FastAPI backend is running (<code>uvicorn backend.main:app --reload --port 8000</code>) or via Docker.
            </small>
          </div>
        )}

        {activeTab === 'overview' && (
          <section className="tab-pane">
            <div className="grid-2">
              {/* System Specs Card */}
              <div className="card glass">
                <div className="card-header">
                  <h3 className="card-title">Foundation Status (Phase 1)</h3>
                  <span className="badge badge-success">[PASSED]</span>
                </div>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Platform Name</span>
                    <span className="stat-val">{health?.app_name || 'FinanceBtw'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">API Version</span>
                    <span className="stat-val">{health?.version || '0.1.0'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Environment</span>
                    <span className="stat-val">{health?.environment || 'development'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Python Version</span>
                    <span className="stat-val">{health?.python_version || '3.12+'}</span>
                  </div>
                </div>

                <div className="feature-list">
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong>Market-Agnostic Abstraction Layer</strong>
                      <p>Abstract <code>MarketProvider</code> contract allows seamless switching between Yahoo Finance, NSE, BSE, & News without touching core agent logic.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong>Asynchronous FastAPI Backend</strong>
                      <p>High-throughput async event loop with thread pooling for external scrapers.</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong>Zero Demat Account Requirement</strong>
                      <p>100% free MVP data stack (yfinance + nsepython + bsedata + TheNewsAPI).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Blueprint Card */}
              <div className="card glass">
                <div className="card-header">
                  <h3 className="card-title">Decoupled Architecture</h3>
                </div>
                <div className="arch-box">
                  <div className="arch-node arch-frontend">
                    [UI] React Frontend (Vite + TS)
                  </div>
                  <div className="arch-arrow">| REST / WebSocket</div>
                  <div className="arch-arrow">v</div>
                  <div className="arch-node arch-backend">
                    [API] FastAPI Backend (Core Engine)
                  </div>
                  <div className="arch-split">
                    <div className="arch-sub arch-rag">
                      [RAG] AI Agent & Hybrid RAG (Qdrant + BM25)
                    </div>
                    <div className="arch-sub arch-market">
                      [DATA] Market Provider Registry
                    </div>
                  </div>
                  <div className="arch-arrow">| Provider Protocol</div>
                  <div className="arch-arrow">v</div>
                  <div className="arch-providers-row">
                    <span className="provider-tag">yfinance (.NS/.BO/US)</span>
                    <span className="provider-tag">nsepython (REST/Indices)</span>
                    <span className="provider-tag">TheNewsAPI (Financial News)</span>
                    <span className="provider-tag">bsedata</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'providers' && (
          <section className="tab-pane">
            <div className="grid-2">
              {/* Yahoo Finance */}
              <div className="card glass">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Yahoo Finance Provider</h3>
                    <span className="text-muted">Primary Market Quotes & History</span>
                  </div>
                  <span className="badge badge-success">[FREE]</span>
                </div>
                <p className="card-desc">
                  Supplies real-time/delayed prices, 52-week ranges, market cap, financial ratios (P/E, P/B, ROE, EPS), and OHLCV candlestick historical data.
                </p>
                <div className="provider-meta">
                  <div className="meta-row"><span>Library:</span> <code>yfinance &gt;= 1.5.0</code></div>
                  <div className="meta-row"><span>NSE Suffix:</span> <code>.NS (e.g. RELIANCE.NS, TCS.NS)</code></div>
                  <div className="meta-row"><span>BSE Suffix:</span> <code>.BO (e.g. RELIANCE.BO)</code></div>
                  <div className="meta-row"><span>Global:</span> <code>AAPL, MSFT, NVDA, TSLA</code></div>
                </div>
              </div>

              {/* NSE India */}
              <div className="card glass">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">NSE India Provider</h3>
                    <span className="text-muted">Official NSE REST API Scraper</span>
                  </div>
                  <span className="badge badge-success">[FREE]</span>
                </div>
                <p className="card-desc">
                  Provides direct NSE quotes, Nifty 50 / Bank Nifty index levels, corporate events calendars, dividends, and institutional FII/DII activity.
                </p>
                <div className="provider-meta">
                  <div className="meta-row"><span>Library:</span> <code>nsepython &gt;= 2.97</code></div>
                  <div className="meta-row"><span>Endpoints:</span> <code>nse_eq, nse_get_index_quote, nse_events</code></div>
                  <div className="meta-row"><span>Purification:</span> Strips exchange suffixes automatically</div>
                </div>
              </div>

              {/* TheNewsAPI */}
              <div className="card glass">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">TheNewsAPI Provider</h3>
                    <span className="text-muted">Curated Financial & Business News</span>
                  </div>
                  <span className="badge badge-info">[ACTIVE]</span>
                </div>
                <p className="card-desc">
                  Fetches live Indian market headlines, business developments, and stock-specific news articles with provenance citations.
                </p>
                <div className="provider-meta">
                  <div className="meta-row"><span>Endpoint:</span> <code>https://api.thenewsapi.com/v1/news/all</code></div>
                  <div className="meta-row"><span>Filters:</span> <code>locale=in &amp; categories=business</code></div>
                  <div className="meta-row"><span>Auth:</span> Bearer Token in <code>.env</code></div>
                </div>
              </div>

              {/* BSE India */}
              <div className="card glass">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">BSE India Provider</h3>
                    <span className="text-muted">Bombay Stock Exchange Metadata</span>
                  </div>
                  <span className="badge badge-secondary">[PHASE 11 STUB]</span>
                </div>
                <p className="card-desc">
                  Extracts BSE scrip codes, company information, and quotes for companies exclusively listed on the Bombay Stock Exchange.
                </p>
                <div className="provider-meta">
                  <div className="meta-row"><span>Library:</span> <code>bsedata &gt;= 0.6.0</code></div>
                  <div className="meta-row"><span>Target:</span> BSE Scrip codes (e.g. <code>500325</code>)</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'roadmap' && (
          <section className="tab-pane">
            <div className="card glass">
              <div className="card-header">
                <h3 className="card-title">Development Roadmap Progression</h3>
                <span className="badge badge-primary">Phase 1 of 20 Complete</span>
              </div>
              <div className="roadmap-grid">
                {[
                  { phase: '1', name: 'Repository Foundation', branch: 'feature/project-setup', status: 'done' },
                  { phase: '2', name: 'Authentication (JWT)', branch: 'feature/authentication', status: 'next' },
                  { phase: '3', name: 'Frontend Framework & Layout', branch: 'feature/frontend-layout', status: 'pending' },
                  { phase: '4', name: 'Document Ingestion Pipeline', branch: 'feature/document-ingestion', status: 'pending' },
                  { phase: '5', name: 'Semantic Chunking & Overlap', branch: 'feature/chunking', status: 'pending' },
                  { phase: '6', name: 'BGE-M3 Embeddings & Qdrant', branch: 'feature/embeddings', status: 'pending' },
                  { phase: '7', name: 'Hybrid Retriever (BM25 + Vector)', branch: 'feature/retriever', status: 'pending' },
                  { phase: '8', name: 'Cross-Encoder Reranker', branch: 'feature/reranker', status: 'pending' },
                  { phase: '9', name: 'Provider-Agnostic LLM Interface', branch: 'feature/llm-interface', status: 'pending' },
                  { phase: '10', name: 'Autonomous Financial AI Agent', branch: 'feature/agent', status: 'pending' },
                  { phase: '11', name: 'Market Data Provider Layer', branch: 'feature/market-api', status: 'pending' },
                  { phase: '12', name: 'Financial Knowledge Base Indexer', branch: 'feature/knowledge-base', status: 'pending' },
                  { phase: '13', name: 'Conversation Memory & Context', branch: 'feature/memory', status: 'pending' },
                  { phase: '14', name: 'Portfolio Analyzer & Risk Engine', branch: 'feature/portfolio', status: 'pending' },
                  { phase: '15', name: 'Natural Language Financial Screener', branch: 'feature/screener', status: 'pending' },
                  { phase: '16', name: 'Interactive Financial Charts', branch: 'feature/charts', status: 'pending' },
                  { phase: '17', name: 'Research Report Generator (PDF/MD)', branch: 'feature/reports', status: 'pending' },
                  { phase: '18', name: 'Financial Safety & Citation Guardrails', branch: 'feature/guardrails', status: 'pending' },
                  { phase: '19', name: 'Docker Compose & Nginx Production', branch: 'feature/deployment', status: 'pending' },
                  { phase: '20', name: 'Production Documentation & Final Merge', branch: 'feature/documentation', status: 'pending' },
                ].map((item) => (
                  <div key={item.phase} className={`roadmap-card ${item.status}`}>
                    <div className="roadmap-badge">Phase {item.phase}</div>
                    <h4 className="roadmap-title">{item.name}</h4>
                    <code className="roadmap-branch">{item.branch}</code>
                    <div className="roadmap-status-text">
                      {item.status === 'done' && '[DONE] Completed & Verified'}
                      {item.status === 'next' && '[NEXT] Ready for Implementation'}
                      {item.status === 'pending' && '[PENDING] Scheduled'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>FinanceBtw v0.1.0 -- Production-grade AI financial research assistant</span>
        <span>FastAPI | React | TypeScript | Qdrant | Redis</span>
      </footer>
    </div>
  );
};

export default App;
