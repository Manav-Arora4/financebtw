import React, { useState } from 'react';

interface DocumentItem {
  id: string;
  name: string;
  ticker: string;
  category: 'Annual Report' | 'Earnings Transcript' | 'SEBI Circular' | 'RBI Policy';
  size: string;
  chunks: number;
  indexedAt: string;
  status: 'indexed' | 'processing';
}

export const DocumentsPage: React.FC = () => {
  const [documents] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Reliance_Industries_Integrated_Annual_Report_FY24.pdf',
      ticker: 'RELIANCE.NS',
      category: 'Annual Report',
      size: '14.8 MB',
      chunks: 1420,
      indexedAt: '2026-08-11 18:30 UTC',
      status: 'indexed',
    },
    {
      id: 'doc-2',
      name: 'TCS_Q3_FY24_Earnings_Call_Transcript.pdf',
      ticker: 'TCS.NS',
      category: 'Earnings Transcript',
      size: '2.1 MB',
      chunks: 340,
      indexedAt: '2026-08-11 18:35 UTC',
      status: 'indexed',
    },
    {
      id: 'doc-3',
      name: 'SEBI_Master_Circular_Portfolio_Managers_2024.pdf',
      ticker: 'ALL_MARKET',
      category: 'SEBI Circular',
      size: '4.5 MB',
      chunks: 890,
      indexedAt: '2026-08-11 18:40 UTC',
      status: 'indexed',
    },
    {
      id: 'doc-4',
      name: 'RBI_Monetary_Policy_Resolution_August_2024.pdf',
      ticker: 'MACRO_INDIA',
      category: 'RBI Policy',
      size: '1.2 MB',
      chunks: 180,
      indexedAt: '2026-08-11 18:45 UTC',
      status: 'indexed',
    },
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">[Financial Knowledge Base &amp; Filings]</h2>
          <p className="page-subtitle">LlamaIndex Ingestion Pipeline, BGE-M3 Embeddings, and Qdrant Vector Storage</p>
        </div>
        <button className="btn btn-primary btn-sm">
          [+] Upload New Document
        </button>
      </div>

      {/* RAG Engine Status Cards */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <div className="card glass">
          <div className="stat-label">Vector Store</div>
          <div className="stat-val">Qdrant</div>
          <div className="text-muted" style={{ marginTop: '0.25rem' }}>
            Collection: <code>financebtw_documents</code>
          </div>
        </div>
        <div className="card glass">
          <div className="stat-label">Embedding Model</div>
          <div className="stat-val">BAAI/bge-m3</div>
          <div className="text-muted" style={{ marginTop: '0.25rem' }}>
            1024-dim Dense + Sparse Vectors (Local)
          </div>
        </div>
        <div className="card glass">
          <div className="stat-label">Total Indexed Nodes</div>
          <div className="stat-val">2,830 Chunks</div>
          <div className="text-muted" style={{ marginTop: '0.25rem' }}>
            Reranker: BGE-Reranker-Large
          </div>
        </div>
      </div>

      {/* Document Upload Dropzone */}
      <div className="card glass" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>[+]</div>
        <h3>Drop Financial PDFs or Reports Here</h3>
        <p className="card-desc" style={{ maxWidth: '500px', margin: '0.5rem auto' }}>
          Supports 10-K, Annual Reports, Earnings Transcripts, and SEBI Circulars. Tabular structures and numeric statements are preserved via LlamaIndex.
        </p>
        <button className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
          Browse Files (.pdf, .docx, .html)
        </button>
      </div>

      {/* Indexed Documents Table */}
      <div className="card glass">
        <div className="card-header">
          <h3 className="card-title">Indexed Knowledge Base Documents</h3>
          <span className="badge badge-success">4 Documents Ready</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Target Asset</th>
                <th>Category</th>
                <th>File Size</th>
                <th>Chunks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <strong>{doc.name}</strong>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Indexed: {doc.indexedAt}</div>
                  </td>
                  <td><code>{doc.ticker}</code></td>
                  <td><span className="badge badge-info">[{doc.category}]</span></td>
                  <td>{doc.size}</td>
                  <td>{doc.chunks} nodes</td>
                  <td>
                    <span className="badge badge-success">[INDEXED]</span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm">
                      Query Doc
                    </button>
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
