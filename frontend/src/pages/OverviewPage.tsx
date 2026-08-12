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
  const [error, setError] = useState<string | null>(null);

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
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">[Architecture &amp; System Roadmap]</h2>
          <p className="page-subtitle">End-to-End System Specifications, AI Framework Stack, and Development Progress</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchHealth} disabled={loading}>
          {loading ? 'Checking...' : 'Refresh Health'}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning">
          <strong>Backend Connection Notice: </strong> {error}
        </div>
      )}

      {/* Grid 1: System Specs & Topology */}
      <div className="grid-2">
        <div className="card glass">
          <div className="card-header">
            <h3 className="card-title">Production Foundation Specs</h3>
            <span className="badge badge-success">[PHASE 1-3 ACTIVE]</span>
          </div>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Platform</span>
              <span className="stat-val">{health?.app_name || 'FinanceBtw'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Agent Engine</span>
              <span className="stat-val">LangGraph</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">RAG Engine</span>
              <span className="stat-val">LlamaIndex</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">LLM Gateway</span>
              <span className="stat-val">LiteLLM</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Vector Embeddings</span>
              <span className="stat-val">BGE-M3 (Local)</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Reranker</span>
              <span className="stat-val">BGE-Reranker-Large</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Vector Store</span>
              <span className="stat-val">Qdrant</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Authentication</span>
              <span className="stat-val">Supabase JWT</span>
            </div>
          </div>
        </div>

        <div className="card glass">
          <div className="card-header">
            <h3 className="card-title">End-to-End AI Architecture</h3>
            <span className="badge badge-info">Zero-Broker Topology</span>
          </div>
          <div className="arch-flow">
            <div className="arch-node">
              <div className="arch-node-title">[UI] React 19 Frontend</div>
              <div className="arch-node-desc">TypeScript - Vite - Zustand - Supabase Client</div>
            </div>
            <div className="arch-arrow">|</div>
            <div className="arch-node">
              <div className="arch-node-title">[AGENT] LangGraph Orchestrator</div>
              <div className="arch-node-desc">Multi-step Planning - Tool Routing - State Checkpointing</div>
            </div>
            <div className="arch-arrow">|</div>
            <div className="arch-node">
              <div className="arch-node-title">[RAG] LlamaIndex Hybrid Engine</div>
              <div className="arch-node-desc">BGE-M3 - BM25 - Qdrant - BGE-Reranker-Large</div>
            </div>
            <div className="arch-arrow">|</div>
            <div className="arch-node">
              <div className="arch-node-title">[DATA] Market Provider Abstraction</div>
              <div className="arch-node-desc">Yahoo Finance (yfinance) - NSE (nsepython) - TheNewsAPI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2: 20-Phase Roadmap */}
      <div className="card glass" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3 className="card-title">Master 20-Phase Development Roadmap</h3>
          <span className="badge badge-primary">Phase 3 of 20 Active</span>
        </div>
        <div className="roadmap-grid">
          {[
            { phase: '1', name: 'Repository Foundation', branch: 'feature/project-setup', status: 'done' },
            { phase: '2', name: 'Supabase Authentication', branch: 'feature/authentication', status: 'done' },
            { phase: '3', name: 'Frontend Framework & Layout', branch: 'feature/frontend-layout', status: 'done' },
            { phase: '4', name: 'Document Ingestion Pipeline (LlamaIndex)', branch: 'feature/document-ingestion', status: 'next' },
            { phase: '5', name: 'Semantic Chunking & Tabular Parser', branch: 'feature/chunking', status: 'pending' },
            { phase: '6', name: 'BGE-M3 Embeddings & Qdrant Storage', branch: 'feature/embeddings', status: 'pending' },
            { phase: '7', name: 'Hybrid Retriever (BM25 + Dense + RRF)', branch: 'feature/retriever', status: 'pending' },
            { phase: '8', name: 'Local BGE-Reranker-Large Cross-Encoder', branch: 'feature/reranker', status: 'pending' },
            { phase: '9', name: 'Unified LiteLLM Gateway & Tools', branch: 'feature/llm-interface', status: 'pending' },
            { phase: '10', name: 'Autonomous Financial AI Agent (LangGraph)', branch: 'feature/agent', status: 'pending' },
            { phase: '11', name: 'Market Data Provider Layer & Fallbacks', branch: 'feature/market-api', status: 'pending' },
            { phase: '12', name: 'Financial Knowledge Base Indexer', branch: 'feature/knowledge-base', status: 'pending' },
            { phase: '13', name: 'Conversation Memory & Checkpoints', branch: 'feature/memory', status: 'pending' },
            { phase: '14', name: 'Portfolio Analyzer & Risk Engine', branch: 'feature/portfolio', status: 'pending' },
            { phase: '15', name: 'Natural Language Financial Screener', branch: 'feature/screener', status: 'pending' },
            { phase: '16', name: 'Interactive Financial Charts (TradingView)', branch: 'feature/charts', status: 'pending' },
            { phase: '17', name: 'Research Report Generator (PDF/MD)', branch: 'feature/reports', status: 'pending' },
            { phase: '18', name: 'Financial Safety & Citation Guardrails', branch: 'feature/guardrails', status: 'pending' },
            { phase: '19', name: 'Production Docker Compose & Nginx', branch: 'feature/deployment', status: 'pending' },
            { phase: '20', name: 'Production Documentation & Release', branch: 'feature/documentation', status: 'pending' },
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
    </div>
  );
};
