import React, { useState } from 'react';

interface DocumentItem {
  id: string;
  name: string;
  ticker: string;
  category: string;
  size: string;
  chunks: number;
  tokens: string;
  indexedAt: string;
  status: 'indexed' | 'processing';
}

export const DocumentsPage: React.FC = () => {
  const [documents] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Reliance_Industries_Integrated_Annual_Report_FY24.pdf',
      ticker: 'RELIANCE.NS',
      category: 'ANNUAL_REPORT',
      size: '14.8 MB',
      chunks: 1420,
      tokens: '412K',
      indexedAt: '2026-08-11 18:30:15 UTC',
      status: 'indexed',
    },
    {
      id: 'doc-2',
      name: 'TCS_Q3_FY24_Earnings_Call_Transcript.pdf',
      ticker: 'TCS.NS',
      category: 'TRANSCRIPT',
      size: '2.1 MB',
      chunks: 340,
      tokens: '98K',
      indexedAt: '2026-08-11 18:35:40 UTC',
      status: 'indexed',
    },
    {
      id: 'doc-3',
      name: 'SEBI_Master_Circular_Portfolio_Managers_2024.pdf',
      ticker: 'REG_INDIA',
      category: 'SEBI_CIRCULAR',
      size: '4.5 MB',
      chunks: 890,
      tokens: '254K',
      indexedAt: '2026-08-11 18:40:02 UTC',
      status: 'indexed',
    },
    {
      id: 'doc-4',
      name: 'RBI_Monetary_Policy_Resolution_August_2024.pdf',
      ticker: 'MACRO_INDIA',
      category: 'RBI_POLICY',
      size: '1.2 MB',
      chunks: 180,
      tokens: '52K',
      indexedAt: '2026-08-11 18:45:18 UTC',
      status: 'indexed',
    },
  ]);

  return (
    <div className="terminal-documents-page">
      {/* Top Header */}
      <div className="terminal-page-header">
        <div className="header-title-block">
          <span className="terminal-code-tag">&lt;RAG&gt;</span>
          <div>
            <h2 className="terminal-title">FINANCIAL KNOWLEDGE BASE &amp; FILINGS WORKSTATION</h2>
            <p className="terminal-sub">LlamaIndex Hybrid Ingestion, BGE-M3 Dense+Sparse Vectors, Qdrant Collection &amp; Cross-Encoder</p>
          </div>
        </div>
        <div className="header-action-btns">
          <button className="btn-term-primary">&lt;UPLOAD FILING&gt;</button>
          <button className="btn-term-sec">&lt;REINDEX ALL&gt;</button>
        </div>
      </div>

      {/* RAG Engine Status Cards */}
      <div className="terminal-metrics-grid">
        <div className="term-stat-card">
          <span className="term-stat-code">&lt;VDB&gt;</span>
          <span className="term-stat-lbl">VECTOR STORE</span>
          <span className="term-stat-val">QDRANT</span>
          <div className="term-stat-sub">COLLECTION: <code>financebtw_documents</code></div>
        </div>

        <div className="term-stat-card">
          <span className="term-stat-code">&lt;EMB&gt;</span>
          <span className="term-stat-lbl">EMBEDDING MODEL</span>
          <span className="term-stat-val">BAAI/bge-m3</span>
          <div className="term-stat-sub">1024-DIM DENSE + SPARSE (LOCAL)</div>
        </div>

        <div className="term-stat-card">
          <span className="term-stat-code">&lt;RERANK&gt;</span>
          <span className="term-stat-lbl">CROSS-ENCODER RERANKER</span>
          <span className="term-stat-val pos">BGE-RERANKER-LARGE</span>
          <div className="term-stat-sub">TOP-K RESCORING (LOCAL)</div>
        </div>

        <div className="term-stat-card">
          <span className="term-stat-code">&lt;NODES&gt;</span>
          <span className="term-stat-lbl">TOTAL INDEXED NODES</span>
          <span className="term-stat-val pos">2,830 CHUNKS</span>
          <div className="term-stat-sub">816K FINANCIAL TOKENS INDEXED</div>
        </div>
      </div>

      {/* Terminal Upload Dropzone */}
      <div className="terminal-panel" style={{ marginTop: '1.25rem', padding: '1.5rem', textAlign: 'center' }}>
        <div className="dropzone-terminal">
          <span className="drop-code">&lt;INPUT DROPZONE&gt;</span>
          <div className="drop-title">DRAG &amp; DROP FINANCIAL FILINGS OR ANNUAL REPORTS HERE</div>
          <div className="drop-sub">Preserves tables, footnotes, multi-column statements, and numeric balance sheets via LlamaIndex</div>
          <button className="btn-term-primary" style={{ marginTop: '0.75rem' }}>
            &lt;BROWSE LOCAL FILES (.PDF, .TXT, .HTML)&gt;
          </button>
        </div>
      </div>

      {/* Ingested Documents Table */}
      <div className="terminal-panel" style={{ marginTop: '1.25rem' }}>
        <div className="panel-header">
          <div className="panel-title-group">
            <span className="panel-code">&lt;DOCS&gt;</span>
            <span className="panel-title">INDEXED KNOWLEDGE BASE FILINGS</span>
          </div>
          <span className="source-tag">4 ACTIVE FILINGS</span>
        </div>

        <div className="terminal-table-container">
          <table className="terminal-data-table">
            <thead>
              <tr>
                <th>DOCUMENT NAME</th>
                <th>TARGET TICKER</th>
                <th>CATEGORY</th>
                <th className="num">SIZE</th>
                <th className="num">CHUNKS</th>
                <th className="num">TOKENS</th>
                <th>INDEXED TIMESTAMP</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="term-row">
                  <td className="ticker-cell">
                    <strong>{doc.name}</strong>
                  </td>
                  <td><code>&lt;{doc.ticker}&gt;</code></td>
                  <td><span className="term-badge cyan">[{doc.category}]</span></td>
                  <td className="num">{doc.size}</td>
                  <td className="num">{doc.chunks}</td>
                  <td className="num">{doc.tokens}</td>
                  <td>{doc.indexedAt}</td>
                  <td><span className="term-badge green">[INDEXED]</span></td>
                  <td>
                    <button className="btn-term-action">&lt;QUERY&gt;</button>
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
