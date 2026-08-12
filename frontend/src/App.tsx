import React, { useEffect, useState } from 'react';
import apiClient from './api/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
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

const AppContent: React.FC = () => {
  const { user, signOut, isConfigured } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'auth' | 'roadmap'>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

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

  const handleManualSync = async () => {
    if (!user) return;
    setSyncStatus('Syncing...');
    try {
      const res = await apiClient.post('/api/v1/auth/sync', {});
      setSyncStatus(`Synced successfully! User ID: ${res.data.user_id}`);
    } catch (err: unknown) {
      setSyncStatus(`Sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
          <span className="badge badge-branch">branch: feature/authentication</span>
          <span className={`badge ${health?.status === 'ok' ? 'badge-online' : 'badge-offline'}`}>
            [{health?.status === 'ok' ? 'ONLINE' : 'OFFLINE'}] {health?.status === 'ok' ? 'System Operational' : 'Backend Offline'}
          </span>

          {user ? (
            <div className="user-badge">
              <span>[USER] {user.email}</span>
              <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => signOut()}>
                Sign Out
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)}>
              [+] Sign In / Sign Up
            </button>
          )}

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
          className={`tab-btn ${activeTab === 'auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('auth')}
        >
          [Supabase Auth {user ? '(Active)' : '(Guest)'}]
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
                  <h3 className="card-title">Foundation & Authentication Status</h3>
                  <span className="badge badge-success">[PHASE 1 & 2 ACTIVE]</span>
                </div>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Platform Name</span>
                    <span className="stat-val">{health?.app_name || 'FinanceBtw'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Version</span>
                    <span className="stat-val">{health?.version || '0.1.0'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Environment</span>
                    <span className="stat-val">{health?.environment || 'development'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Auth Engine</span>
                    <span className="stat-val">Supabase JWT</span>
                  </div>
                </div>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong>Decoupled Provider Architecture</strong>
                      <p className="card-desc" style={{ margin: 0 }}>
                        Abstract <code>MarketProvider</code> base class isolating backend logic from live data vendors.
                      </p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong>Supabase Authentication Service</strong>
                      <p className="card-desc" style={{ margin: 0 }}>
                        JWT Bearer token verification, user session management, and local DB synchronization.
                      </p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong>Local Vector &amp; Graph RAG</strong>
                      <p className="card-desc" style={{ margin: 0 }}>
                        LangGraph multi-step agent + LlamaIndex Qdrant hybrid retrieval + BGE-M3 local embeddings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Blueprint Card */}
              <div className="card glass">
                <div className="card-header">
                  <h3 className="card-title">System Topology & Data Pipeline</h3>
                  <span className="badge badge-info">Zero-Broker Architecture</span>
                </div>
                <div className="arch-flow">
                  <div className="arch-node">
                    <div className="arch-node-title">[UI] React 19 Frontend</div>
                    <div className="arch-node-desc">TypeScript - Vite - Zustand - Supabase Client</div>
                  </div>
                  <div className="arch-arrow">|</div>
                  <div className="arch-node">
                    <div className="arch-node-title">[API] FastAPI Application</div>
                    <div className="arch-node-desc">Async REST - JWT Verification - Dependency Injection</div>
                  </div>
                  <div className="arch-arrow">|</div>
                  <div className="arch-node">
                    <div className="arch-node-title">[RAG] LangGraph + LlamaIndex</div>
                    <div className="arch-node-desc">State Graphs - Qdrant - BGE-M3 - LiteLLM Gateway</div>
                  </div>
                  <div className="arch-arrow">|</div>
                  <div className="arch-node">
                    <div className="arch-node-title">[DATA] Market Provider Registry</div>
                    <div className="arch-node-desc">Yahoo Finance - NSE Python - TheNewsAPI</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'auth' && (
          <section className="tab-pane">
            <div className="grid-2">
              <div className="card glass">
                <div className="card-header">
                  <h3 className="card-title">Supabase User Session</h3>
                  <span className={`badge ${user ? 'badge-success' : 'badge-secondary'}`}>
                    {user ? '[AUTHENTICATED]' : '[GUEST MODE]'}
                  </span>
                </div>

                {!isConfigured && (
                  <div className="alert alert-warning">
                    <div className="alert-header">
                      <span className="alert-badge">[!]</span>
                      <strong>Supabase API Keys Needed</strong>
                    </div>
                    <p>
                      Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env</code> to activate real Supabase login.
                    </p>
                  </div>
                )}

                {user ? (
                  <div>
                    <div className="stat-grid">
                      <div className="stat-item">
                        <span className="stat-label">User Email</span>
                        <span className="stat-val" style={{ fontSize: '0.9rem' }}>{user.email}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">User ID (UUID)</span>
                        <span className="stat-val" style={{ fontSize: '0.75rem' }}>{user.id}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Role</span>
                        <span className="stat-val">{user.role || 'authenticated'}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Last Sign In</span>
                        <span className="stat-val" style={{ fontSize: '0.75rem' }}>{user.last_sign_in_at || 'Just now'}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <button className="btn btn-primary" onClick={handleManualSync}>
                        [+] Sync to Local PostgreSQL DB
                      </button>
                      <button className="btn btn-secondary" onClick={() => signOut()}>
                        Sign Out
                      </button>
                    </div>

                    {syncStatus && (
                      <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                        <small>{syncStatus}</small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="card-desc">
                      You are currently browsing as a guest. Authenticate to sync watchlists, financial research portfolios, and conversation histories.
                    </p>
                    <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)}>
                      [+] Open Authentication Modal
                    </button>
                  </div>
                )}
              </div>

              <div className="card glass">
                <div className="card-header">
                  <h3 className="card-title">Protected API Endpoints (Phase 2)</h3>
                  <span className="badge badge-info">FastAPI Dependencies</span>
                </div>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong><code>GET /api/v1/auth/me</code></strong>
                      <p className="card-desc" style={{ margin: 0 }}>
                        Validates Bearer token signature &amp; claims, returning the authenticated user profile.
                      </p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong><code>POST /api/v1/auth/sync</code></strong>
                      <p className="card-desc" style={{ margin: 0 }}>
                        Upserts local PostgreSQL <code>User</code> record linked to Supabase UUID for fast database joins.
                      </p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <span className="icon-check">[+]</span>
                    <div>
                      <strong><code>GET /api/v1/auth/config</code></strong>
                      <p className="card-desc" style={{ margin: 0 }}>
                        Provides public client configuration parameters to frontend clients.
                      </p>
                    </div>
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
                    <span className="text-muted">Primary Market Quotes &amp; History</span>
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
                    <span className="text-muted">Curated Financial &amp; Business News</span>
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
                <span className="badge badge-primary">Phase 2 of 20 Active</span>
              </div>
              <div className="roadmap-grid">
                {[
                  { phase: '1', name: 'Repository Foundation', branch: 'feature/project-setup', status: 'done' },
                  { phase: '2', name: 'Supabase Authentication', branch: 'feature/authentication', status: 'done' },
                  { phase: '3', name: 'Frontend Framework & Layout', branch: 'feature/frontend-layout', status: 'next' },
                  { phase: '4', name: 'Document Ingestion Pipeline (LlamaIndex)', branch: 'feature/document-ingestion', status: 'pending' },
                  { phase: '5', name: 'Semantic Chunking & Overlap (LlamaIndex)', branch: 'feature/chunking', status: 'pending' },
                  { phase: '6', name: 'BGE-M3 Embeddings & Qdrant', branch: 'feature/embeddings', status: 'pending' },
                  { phase: '7', name: 'Hybrid Retriever (BM25 + Dense + RRF)', branch: 'feature/retriever', status: 'pending' },
                  { phase: '8', name: 'Local BGE-Reranker-Large', branch: 'feature/reranker', status: 'pending' },
                  { phase: '9', name: 'Unified LiteLLM Gateway', branch: 'feature/llm-interface', status: 'pending' },
                  { phase: '10', name: 'Autonomous Financial AI Agent (LangGraph)', branch: 'feature/agent', status: 'pending' },
                  { phase: '11', name: 'Market Data Provider Layer & Fallbacks', branch: 'feature/market-api', status: 'pending' },
                  { phase: '12', name: 'Financial Knowledge Base Indexer', branch: 'feature/knowledge-base', status: 'pending' },
                  { phase: '13', name: 'Conversation Memory & Checkpoints', branch: 'feature/memory', status: 'pending' },
                  { phase: '14', name: 'Portfolio Analyzer & Risk Engine', branch: 'feature/portfolio', status: 'pending' },
                  { phase: '15', name: 'Natural Language Financial Screener', branch: 'feature/screener', status: 'pending' },
                  { phase: '16', name: 'Interactive Financial Charts', branch: 'feature/charts', status: 'pending' },
                  { phase: '17', name: 'Research Report Generator (PDF/MD)', branch: 'feature/reports', status: 'pending' },
                  { phase: '18', name: 'Financial Safety & Citation Guardrails', branch: 'feature/guardrails', status: 'pending' },
                  { phase: '19', name: 'Production Docker Compose & Nginx', branch: 'feature/deployment', status: 'pending' },
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Footer */}
      <footer className="footer">
        <span>FinanceBtw v0.1.0 -- Production-grade AI financial research assistant</span>
        <span>FastAPI | Supabase Auth | React | TypeScript | Qdrant | Redis</span>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
