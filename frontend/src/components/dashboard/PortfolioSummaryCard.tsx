import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PortfolioSummaryCard: React.FC = () => {
  const navigate = useNavigate();

  // Dense multi-point realistic intraday equity curve matching the reference image
  const sparklinePath = "M 0,55 L 15,50 L 30,58 L 45,46 L 60,52 L 75,40 L 90,44 L 105,32 L 120,38 L 135,28 L 150,34 L 165,22 L 180,30 L 195,18 L 210,25 L 225,14 L 240,20 L 255,10 L 270,16 L 285,6 L 300,12";
  const sparklineArea = `${sparklinePath} L 300,70 L 0,70 Z`;

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
          <span className="portfolio-pct-delta pos">▲ 3.24% (1D)</span>
        </div>
      </div>

      {/* Full Space High-Definition Portfolio Area Graph */}
      <div className="portfolio-full-sparkline-wrapper">
        <svg viewBox="0 0 300 70" className="portfolio-svg-full-chart" preserveAspectRatio="none">
          <defs>
            <linearGradient id="portGlowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#22c55e" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={sparklineArea}
            fill="url(#portGlowGrad)"
          />
          <path
            d={sparklinePath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Breakdown Rows */}
      <div className="portfolio-sub-metrics-list">
        <div className="port-sub-row">
          <span className="port-sub-lbl">Today's P/L</span>
          <span className="port-sub-val pos">+₹15,124.00 (3.24%)</span>
        </div>
        <div className="port-sub-row">
          <span className="port-sub-lbl">Buying Power</span>
          <span className="port-sub-val">₹82,450.88</span>
        </div>
        <div className="port-sub-row">
          <span className="port-sub-lbl">Cash</span>
          <span className="port-sub-val">₹24,342.19</span>
        </div>
      </div>
    </div>
  );
};
