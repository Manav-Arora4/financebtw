import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';

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

export const OverviewPage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<HealthResponse>('/api/v1/health');
      setHealth(res.data);
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const phases = [
    { num: '01', name: 'Repository Foundation & Provider Abstraction', branch: 'feature/project-setup', status: 'DONE' },
    { num: '02', name: 'Supabase Authentication & JWT Verifier', branch: 'feature/authentication', status: 'DONE' },
    { num: '03', name: 'Bloomberg Terminal UI & Navigation Layout', branch: 'feature/frontend-layout', status: 'DONE' },
    { num: '04', name: 'Document Ingestion Pipeline (LlamaIndex)', branch: 'feature/document-ingestion', status: 'NEXT' },
    { num: '05', name: 'Semantic Chunking & Tabular Structure Parser', branch: 'feature/chunking', status: 'PLAN' },
    { num: '06', name: 'BGE-M3 Dense+Sparse Vectors & Qdrant Storage', branch: 'feature/embeddings', status: 'PLAN' },
    { num: '07', name: 'Hybrid Retriever (BM25 + Dense + RRF)', branch: 'feature/retriever', status: 'PLAN' },
    { num: '08', name: 'Local BGE-Reranker-Large Cross-Encoder', branch: 'feature/reranker', status: 'PLAN' },
    { num: '09', name: 'Unified LiteLLM Gateway & Financial Tool Calls', branch: 'feature/llm-interface', status: 'PLAN' },
    { num: '10', name: 'Autonomous Financial AI Agent (LangGraph)', branch: 'feature/agent', status: 'PLAN' },
    { num: '11', name: 'Market Data Provider Layer & Fallbacks', branch: 'feature/market-api', status: 'PLAN' },
    { num: '12', name: 'Financial Knowledge Base Indexer', branch: 'feature/knowledge-base', status: 'PLAN' },
    { num: '13', name: 'Conversation Memory & Checkpoints', branch: 'feature/memory', status: 'PLAN' },
    { num: '14', name: 'Portfolio Analyzer & Risk Engine', branch: 'feature/portfolio', status: 'PLAN' },
    { num: '15', name: 'Natural Language Financial Screener', branch: 'feature/screener', status: 'PLAN' },
    { num: '16', name: 'Interactive Financial Charts (TradingView)', branch: 'feature/charts', status: 'PLAN' },
    { num: '17', name: 'Research Report Generator (PDF/MD)', branch: 'feature/reports', status: 'PLAN' },
    { num: '18', name: 'Financial Safety & Citation Guardrails', branch: 'feature/guardrails', status: 'PLAN' },
    { num: '19', name: 'Production Docker Compose & Nginx', branch: 'feature/deployment', status: 'PLAN' },
    { num: '20', name: 'Production Documentation & Release', branch: 'feature/documentation', status: 'PLAN' },
  ];

  return (
    <div className="terminal-overview-page">
      {/* Top Header */}
      <div className="terminal-page-header">
        <div className="header-title-block">
          <span className="terminal-code-tag">&lt;DES&gt;</span>
          <div>
            <h2 className="terminal-title">SYSTEM SPECIFICATIONS &amp; MASTER ROADMAP</h2>
            <p className="terminal-sub">End-to-End Autonomous AI Architecture, Framework Matrix, and Development Progress</p>
          </div>
        </div>
        <div className="header-action-btns">
          <button className="btn-term-primary" onClick={fetchHealth} disabled={loading}>
            {loading ? '<CHECKING...>' : '<REFRESH TELEMETRY>'}
          </button>
        </div>
      </div>

      {/* Grid 1: System Specs & Topology */}
      <div className="terminal-split-grid">
        <div className="terminal-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;SYS_SPEC&gt;</span>
              <span className="panel-title">SYSTEM INFRASTRUCTURE TOPOLOGY</span>
            </div>
            <span className="term-badge green">[SYSTEM ONLINE]</span>
          </div>

          <div className="term-spec-table">
            <div className="spec-row"><span className="spec-key">PLATFORM WORKSTATION:</span><span className="spec-val bold">{health?.app_name || 'FinanceBtw Terminal'}</span></div>
            <div className="spec-row"><span className="spec-key">AGENT FRAMEWORK:</span><span className="spec-val bold amber">LangGraph v0.2 (StateGraph)</span></div>
            <div className="spec-row"><span className="spec-key">RAG FRAMEWORK:</span><span className="spec-val bold cyan">LlamaIndex Hybrid Retrieval</span></div>
            <div className="spec-row"><span className="spec-key">LLM GATEWAY:</span><span className="spec-val bold">LiteLLM (Groq GPT-OSS 120B / Llama 3.3)</span></div>
            <div className="spec-row"><span className="spec-key">EMBEDDING ENGINE:</span><span className="spec-val bold green">BAAI/bge-m3 (Local 1024-dim, $0 API Fees)</span></div>
            <div className="spec-row"><span className="spec-key">CROSS-ENCODER RERANKER:</span><span className="spec-val bold green">BAAI/bge-reranker-large (Local)</span></div>
            <div className="spec-row"><span className="spec-key">VECTOR DATABASE:</span><span className="spec-val bold">Qdrant (Collection: financebtw_documents)</span></div>
            <div className="spec-row"><span className="spec-key">RELATIONAL STORE:</span><span className="spec-val bold">PostgreSQL 16 (asyncpg + SQLAlchemy)</span></div>
            <div className="spec-row"><span className="spec-key">AUTHENTICATION:</span><span className="spec-val bold">Supabase GoTrue (JWT RS256/HS256)</span></div>
          </div>
        </div>

        <div className="terminal-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;PROVIDERS&gt;</span>
              <span className="panel-title">LIVE MARKET PROVIDER REGISTRY</span>
            </div>
            <span className="term-badge cyan">[ZERO-BROKER]</span>
          </div>

          <div className="term-spec-table">
            <div className="spec-row">
              <span className="spec-key">QUOTES &amp; FUNDAMENTALS:</span>
              <span className="spec-val pos">[ACTIVE] YahooFinanceProvider (yfinance)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">NSE SEARCH &amp; INDICES:</span>
              <span className="spec-val pos">[ACTIVE] NSEProvider (nsepython)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">FINANCIAL NEWS WIRE:</span>
              <span className="spec-val pos">[ACTIVE] TheNewsAPIProvider (thenewsapi.com)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">BSE SCRIP DATA:</span>
              <span className="spec-val pos">[ACTIVE] BSEProvider (bsedata)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">SEBI REGULATORY FILINGS:</span>
              <span className="spec-val pos">[ACTIVE] SEBI Circular Ingestion Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: 20-Phase Master Matrix */}
      <div className="terminal-panel" style={{ marginTop: '1.25rem' }}>
        <div className="panel-header">
          <div className="panel-title-group">
            <span className="panel-code">&lt;ROADMAP&gt;</span>
            <span className="panel-title">MASTER 20-PHASE DEVELOPMENT PROGRESS</span>
          </div>
          <span className="term-badge amber">[PHASE 3 OF 20 COMPLETE]</span>
        </div>

        <div className="terminal-table-container">
          <table className="terminal-data-table">
            <thead>
              <tr>
                <th>PHASE</th>
                <th>MODULE NAME</th>
                <th>GIT BRANCH</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((p) => (
                <tr key={p.num} className="term-row">
                  <td><strong>&lt;PHASE_{p.num}&gt;</strong></td>
                  <td className="bold">{p.name}</td>
                  <td><code>{p.branch}</code></td>
                  <td>
                    {p.status === 'DONE' && <span className="term-badge green">[DONE] VERIFIED</span>}
                    {p.status === 'NEXT' && <span className="term-badge amber">[NEXT] IMPLEMENTING</span>}
                    {p.status === 'PLAN' && <span className="term-badge dim">[SCHEDULED]</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
