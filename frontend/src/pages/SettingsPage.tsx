import React from 'react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, isConfigured } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">[System Configuration &amp; AI Stack]</h2>
          <p className="page-subtitle">Configure AI Model Gateway, Local Embedding Engines, and Market Data Feeds</p>
        </div>
      </div>

      <div className="grid-2">
        {/* AI Stack Configuration */}
        <div className="card glass">
          <div className="card-header">
            <h3 className="card-title">AI Models &amp; Frameworks</h3>
            <span className="badge badge-success">[ACTIVE]</span>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Agent Orchestration</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Framework: <code>LangGraph</code> | Architecture: State Graph with PostgreSQL Checkpoints
                </p>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Universal LLM Gateway</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Abstraction: <code>LiteLLM</code> | Active Provider: <code>Groq (GPT-OSS 120B / Llama 3.3)</code>
                </p>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Local Embeddings (Zero API Fees)</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Model: <code>BAAI/bge-m3</code> | 1024-dim Dense + Sparse Vectors (Local)
                </p>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Local Cross-Encoder Reranker</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Model: <code>BAAI/bge-reranker-large</code> | Top-K Candidate Rescoring (Local)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Supabase & Database Config */}
        <div className="card glass">
          <div className="card-header">
            <h3 className="card-title">Authentication &amp; Storage</h3>
            <span className={`badge ${isConfigured ? 'badge-success' : 'badge-warning'}`}>
              {isConfigured ? '[CONFIGURED]' : '[KEYS NEEDED]'}
            </span>
          </div>
          <div className="feature-list">
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Supabase Authentication</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Engine: Supabase Auth GoTrue | User: <code>{user ? user.email : 'Guest Session'}</code>
                </p>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Relational Database</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Engine: <code>PostgreSQL 16</code> | Driver: <code>asyncpg</code> | ORM: <code>SQLAlchemy 2.x</code>
                </p>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>Vector Database</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Engine: <code>Qdrant</code> | Collection: <code>financebtw_documents</code>
                </p>
              </div>
            </div>
            <div className="feature-item">
              <span className="icon-check">[+]</span>
              <div>
                <strong>In-Memory Cache</strong>
                <p className="card-desc" style={{ margin: 0 }}>
                  Engine: <code>Redis 7</code> | Market Quotes TTL: <code>300s</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
