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
          <span className="portfolio-value-number">₹4,81,713.00</span>
          <span className="portfolio-pct-delta pos">▲ +3.24% (1D)</span>
        </div>
      </div>

      {/* Mini Area Sparkline Chart */}
      <div className="portfolio-sparkline-box">
        <svg viewBox="0 0 200 35" className="portfolio-svg-sparkline">
          <defs>
            <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M 0,30 Q 30,22 60,25 T 120,12 T 160,16 T 200,4 L 200,35 L 0,35 Z"
            fill="url(#portGrad)"
          />
          <path
            d="M 0,30 Q 30,22 60,25 T 120,12 T 160,16 T 200,4"
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
          <span className="port-sub-val pos">+₹15,124.00 (+3.24%)</span>
        </div>
        <div className="port-sub-row">
          <span className="port-sub-lbl">Available Margin</span>
          <span className="port-sub-val">₹82,450.00</span>
        </div>
        <div className="port-sub-row">
          <span className="port-sub-lbl">Free Cash</span>
          <span className="port-sub-val">₹24,320.00</span>
        </div>
      </div>
    </div>
  );
};
