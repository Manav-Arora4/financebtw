import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

interface DocumentItem {
  id: string;
  name: string;
  ticker: string;
  category: string;
  size: string;
  pages: number;
  indexedAt: string;
  status: 'READY' | 'PROCESSING';
}

export const DocumentsPage: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const [documents] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      name: 'Reliance_Industries_Integrated_Annual_Report_FY24.pdf',
      ticker: 'RELIANCE.NS',
      category: 'ANNUAL_REPORT',
      size: '14.8 MB',
      pages: 486,
      indexedAt: '2026-08-11 18:30',
      status: 'READY',
    },
    {
      id: 'doc-2',
      name: 'TCS_Q3_FY24_Earnings_Call_Transcript.pdf',
      ticker: 'TCS.NS',
      category: 'TRANSCRIPT',
      size: '2.1 MB',
      pages: 32,
      indexedAt: '2026-08-11 18:35',
      status: 'READY',
    },
    {
      id: 'doc-3',
      name: 'SEBI_Master_Circular_Portfolio_Managers_2024.pdf',
      ticker: 'REG_INDIA',
      category: 'REGULATORY',
      size: '4.5 MB',
      pages: 124,
      indexedAt: '2026-08-11 18:40',
      status: 'READY',
    },
    {
      id: 'doc-4',
      name: 'RBI_Monetary_Policy_Resolution_August_2024.pdf',
      ticker: 'MACRO_INDIA',
      category: 'POLICY',
      size: '1.2 MB',
      pages: 18,
      indexedAt: '2026-08-11 18:45',
      status: 'READY',
    },
  ]);

  const filteredDocs =
    filterCategory === 'ALL'
      ? documents
      : documents.filter((d) => d.category === filterCategory);

  const handleQueryDoc = (ticker: string) => {
    if (ticker && ticker !== 'ALL_MARKET' && ticker !== 'REG_INDIA' && ticker !== 'MACRO_INDIA') {
      setSelectedSymbol(ticker);
    }
    navigate('/chat');
  };

  return (
    <div className="terminal-documents-container">
      {/* Top Header */}
      <div className="documents-top-bar">
        <div>
          <h2 className="doc-page-heading">FINANCIAL FILINGS &amp; RESEARCH REPORTS</h2>
          <p className="doc-page-sub">Access verified annual reports, earnings call transcripts, and regulatory circulars</p>
        </div>
        <button className="btn-upload-filing">
          [+] Upload New Document
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="doc-filter-strip">
        {['ALL', 'ANNUAL_REPORT', 'TRANSCRIPT', 'REGULATORY', 'POLICY'].map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            [{cat.replace('_', ' ')}]
          </button>
        ))}
      </div>

      {/* Upload Dropzone */}
      <div className="document-upload-card">
        <div className="dropzone-inner">
          <span className="dropzone-icon">[+]</span>
          <h3 className="dropzone-title">Drop Annual Reports, 10-K Filings, or Transcripts Here</h3>
          <p className="dropzone-sub">
            Tables, financial footnotes, and balance sheet statements are automatically indexed for instant AI analysis.
          </p>
          <button className="btn-browse-files">
            Browse Files (.PDF, .DOCX, .TXT)
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="documents-panel">
        <div className="panel-header-line">
          <span className="panel-hdr-title">INDEXED REPOSITORY</span>
          <span className="doc-count-badge">{filteredDocs.length} DOCUMENTS READY</span>
        </div>

        <div className="table-wrapper">
          <table className="terminal-table-full">
            <thead>
              <tr>
                <th>DOCUMENT NAME</th>
                <th>TARGET TICKER</th>
                <th>CATEGORY</th>
                <th className="num">FILE SIZE</th>
                <th className="num">PAGES</th>
                <th>UPLOAD DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="doc-row">
                  <td className="doc-name-cell">
                    <strong>{doc.name}</strong>
                  </td>
                  <td><code>{doc.ticker}</code></td>
                  <td><span className="category-tag">[{doc.category}]</span></td>
                  <td className="num">{doc.size}</td>
                  <td className="num">{doc.pages}</td>
                  <td>{doc.indexedAt}</td>
                  <td><span className="status-tag-green">[{doc.status}]</span></td>
                  <td>
                    <button
                      className="btn-query-doc"
                      onClick={() => handleQueryDoc(doc.ticker)}
                    >
                      &lt;ANALYZE WITH AI&gt;
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
