import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PortfolioSummaryCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="finsight-card my-portfolio-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">My Portfolio</h3>
        <button
          className="btn-card-action-text"
          onClick={() => navigate('/portfolio')}
        >
          View Portfolio &gt;
        </button>
      </div>

      <div className="portfolio-total-block">
        <span className="portfolio-total-label">Total Value</span>
        <div className="portfolio-total-row">
          <span className="portfolio-value-number">$128,721.34</span>
          <span className="portfolio-pct-delta pos">▲ +3.24% (1D)</span>
        </div>
      </div>

      {/* Mini Area Sparkline Chart */}
      <div className="portfolio-sparkline-box">
        <svg viewBox="0 0 200 40" className="portfolio-svg-sparkline">
          <defs>
            <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0,35 Q 30,28 60,30 T 120,15 T 160,20 T 200,5 L 200,40 L 0,40 Z"
            fill="url(#portGrad)"
          />
          <path
            d="M 0,35 Q 30,28 60,30 T 120,15 T 160,20 T 200,5"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Breakdown Rows */}
      <div className="portfolio-sub-metrics-list">
        <div className="port-sub-row">
          <span className="port-sub-lbl">Today's P/L</span>
          <span className="port-sub-val pos">+₹3,35,503 (+$4,042.21)</span>
        </div>
        <div className="port-sub-row">
          <span className="port-sub-lbl">Buying Power</span>
          <span className="port-sub-val">$12,430.88</span>
        </div>
        <div className="port-sub-row">
          <span className="port-sub-lbl">Cash</span>
          <span className="port-sub-val">$8,342.19</span>
        </div>
      </div>
    </div>
  );
};
