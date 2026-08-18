import React, { useState } from 'react';
import type { Citation } from './types';
import './ResearchInspectorPanel.css';

interface Props {
  symbol?: string;
  activeCitation: Citation | null;
  isOpen: boolean;
  onToggle: () => void;
}

export const ResearchInspectorPanel: React.FC<Props> = ({
  symbol,
  activeCitation,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'tearsheet' | 'citation'>('citation');

  if (!isOpen) {
    return (
      <button
        type="button"
        className="btn-inspector-reopen"
        onClick={onToggle}
        title="Open Research Inspector"
      >
        <span>Inspector</span>
        <span className="reopen-arrow">‹</span>
      </button>
    );
  }

  const clean = symbol ? symbol.replace('.NS', '').replace('.BO', '') : 'RELIANCE';

  return (
    <aside className="research-inspector-panel">
      {/* Header */}
      <div className="inspector-top-header">
        <div className="inspector-tab-pills">
          <button
            type="button"
            className={`inspector-tab-btn ${activeTab === 'citation' ? 'active' : ''}`}
            onClick={() => setActiveTab('citation')}
          >
            Citations &amp; Sources
          </button>
          <button
            type="button"
            className={`inspector-tab-btn ${activeTab === 'tearsheet' ? 'active' : ''}`}
            onClick={() => setActiveTab('tearsheet')}
          >
            Tear Sheet ({clean})
          </button>
        </div>

        <button
          type="button"
          className="btn-inspector-close"
          onClick={onToggle}
          title="Collapse Inspector"
        >
          ✕
        </button>
      </div>

      {/* Body Content */}
      <div className="inspector-body-scroll">
        {activeTab === 'citation' ? (
          <div className="citation-inspector-view">
            {activeCitation ? (
              <div className="citation-detail-card">
                <div className="citation-header-line">
                  <span className="citation-doc-badge">Source Citation</span>
                  <span className="citation-conf-pill">
                    {(activeCitation.confidenceScore * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <h4 className="citation-doc-title">{activeCitation.documentName}</h4>

                <div className="citation-meta-strip">
                  <span>Page: <strong>{activeCitation.pageNumber || 1}</strong></span>
                  <span>•</span>
                  <span>Filing: <strong>{activeCitation.filingDate || 'Q3 FY25'}</strong></span>
                  <span>•</span>
                  <span>Source: <strong>{activeCitation.source}</strong></span>
                </div>

                <div className="citation-passage-box">
                  <span className="passage-quote-icon">“</span>
                  <p className="passage-text">{activeCitation.excerpt}</p>
                </div>

                {activeCitation.url && (
                  <a
                    href={activeCitation.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-view-original-filing"
                  >
                    View Original Filing PDF →
                  </a>
                )}
              </div>
            ) : (
              <div className="citation-empty-hint">
                <div className="hint-icon">📄</div>
                <h5 className="hint-title">No Citation Selected</h5>
                <p className="hint-desc">
                  Click any superscription pill (e.g. <code>[1]</code>, <code>[2]</code>) in the research chat to inspect the verified filing passage, page number, and confidence score.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="tearsheet-inspector-view">
            <div className="tearsheet-hero-block">
              <span className="tearsheet-sym">{clean}</span>
              <span className="tearsheet-name">Active Context Security</span>
            </div>

            {/* Quick Metrics */}
            <div className="tearsheet-metrics-grid">
              <div className="tearsheet-metric-item">
                <span className="ts-lbl">P/E Ratio</span>
                <span className="ts-val">23.8x</span>
              </div>
              <div className="tearsheet-metric-item">
                <span className="ts-lbl">P/B Ratio</span>
                <span className="ts-val">1.98x</span>
              </div>
              <div className="tearsheet-metric-item">
                <span className="ts-lbl">EV / EBITDA</span>
                <span className="ts-val">11.6x</span>
              </div>
              <div className="tearsheet-metric-item">
                <span className="ts-lbl">Debt / Equity</span>
                <span className="ts-val">0.37</span>
              </div>
            </div>

            {/* DuPont ROE Model Box */}
            <div className="dupont-inspector-box">
              <div className="dupont-box-title">DuPont ROE Decomposition</div>
              <div className="dupont-math-strip">
                <div className="dupont-factor">
                  <span className="factor-num">8.4%</span>
                  <span className="factor-lbl">Net Margin</span>
                </div>
                <span className="dupont-operator">×</span>
                <div className="dupont-factor">
                  <span className="factor-num">0.62x</span>
                  <span className="factor-lbl">Asset Turnover</span>
                </div>
                <span className="dupont-operator">×</span>
                <div className="dupont-factor">
                  <span className="factor-num">2.14x</span>
                  <span className="factor-lbl">Equity Multiplier</span>
                </div>
              </div>
              <div className="dupont-total-result">
                <span>Calculated ROE:</span>
                <strong className="dupont-total-num">11.14%</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
