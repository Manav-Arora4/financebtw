import React from 'react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, isConfigured } = useAuth();
  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'GUEST');

  return (
    <div className="terminal-settings-page">
      {/* Top Header */}
      <div className="terminal-page-header">
        <div className="header-title-block">
          <span className="terminal-code-tag">&lt;CFG&gt;</span>
          <div>
            <h2 className="terminal-title">TERMINAL CONFIGURATION &amp; AI MODEL GATEWAY</h2>
            <p className="terminal-sub">Manage LiteLLM Routing, Local Embedding Engines, Database Caching &amp; API Keys</p>
          </div>
        </div>
      </div>

      <div className="terminal-split-grid">
        {/* AI Stack Configuration */}
        <div className="terminal-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;AI_ENGINE&gt;</span>
              <span className="panel-title">AI MODELS &amp; FRAMEWORKS</span>
            </div>
            <span className="term-badge green">[ACTIVE]</span>
          </div>

          <div className="term-spec-table">
            <div className="spec-row">
              <span className="spec-key">AGENT ORCHESTRATION:</span>
              <span className="spec-val bold amber">LangGraph v0.2 (StateGraph Checkpoints)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">PRIMARY LLM GATEWAY:</span>
              <span className="spec-val bold">LiteLLM (Groq GPT-OSS 120B / Llama 3.3 70B)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">LOCAL EMBEDDING MODEL:</span>
              <span className="spec-val bold green">BAAI/bge-m3 (Dense 1024-dim + Sparse Lexical)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">CROSS-ENCODER RERANKER:</span>
              <span className="spec-val bold green">BAAI/bge-reranker-large (Local Rescorer)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">HYBRID RAG RETRIEVER:</span>
              <span className="spec-val bold cyan">LlamaIndex VectorIndex + BM25 + Reciprocal Rank Fusion</span>
            </div>
          </div>
        </div>

        {/* Database & Storage Config */}
        <div className="terminal-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;STORAGE&gt;</span>
              <span className="panel-title">STORAGE &amp; IDENTITY STACK</span>
            </div>
            <span className={`term-badge ${isConfigured ? 'green' : 'amber'}`}>
              {isConfigured ? '[CONFIGURED]' : '[KEYS NEEDED]'}
            </span>
          </div>

          <div className="term-spec-table">
            <div className="spec-row">
              <span className="spec-key">IDENTITY ENGINE:</span>
              <span className="spec-val bold">Supabase GoTrue (JWT Token Auth)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">ACTIVE SESSION:</span>
              <span className="spec-val bold cyan">@{username} {user ? `(${user.email})` : '[GUEST]'}</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">VECTOR DATABASE:</span>
              <span className="spec-val bold">Qdrant (Collection: financebtw_documents)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">RELATIONAL DATABASE:</span>
              <span className="spec-val bold">PostgreSQL 16 (asyncpg + SQLAlchemy)</span>
            </div>
            <div className="spec-row">
              <span className="spec-key">CACHE &amp; RATE LIMITS:</span>
              <span className="spec-val bold">Redis 7 (Market Quotes TTL: 300s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
