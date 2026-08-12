import React from 'react';

export const AnalystRatingsCard: React.FC = () => {
  return (
    <div className="finsight-card analyst-ratings-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Analyst Ratings</h3>
      </div>

      <div className="analyst-gauge-and-breakdown">
        {/* SVG Circular Ring Gauge */}
        <div className="analyst-circle-gauge-wrapper">
          <svg viewBox="0 0 100 100" className="gauge-svg">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset="55"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="gauge-center-text">
            <span className="gauge-score-number">4.3</span>
            <span className="gauge-score-label">Outperform</span>
          </div>
        </div>

        {/* Ratings Breakdown List */}
        <div className="ratings-breakdown-list">
          <div className="rating-row">
            <div className="rating-row-label">
              <span className="dot-indicator green"></span>
              <span>Buy</span>
            </div>
            <span className="rating-row-count">25 (78%)</span>
          </div>

          <div className="rating-row">
            <div className="rating-row-label">
              <span className="dot-indicator amber"></span>
              <span>Hold</span>
            </div>
            <span className="rating-row-count">6 (19%)</span>
          </div>

          <div className="rating-row">
            <div className="rating-row-label">
              <span className="dot-indicator red"></span>
              <span>Sell</span>
            </div>
            <span className="rating-row-count">1 (3%)</span>
          </div>
        </div>
      </div>

      {/* Target & Consensus Row */}
      <div className="analyst-target-row">
        <div className="target-col">
          <span className="target-sub-lbl">Price Target</span>
          <span className="target-val-num">$210.45</span>
          <span className="target-upside-text pos">▲ +7.47% Upside</span>
        </div>
        <div className="consensus-col">
          <span className="target-sub-lbl">Consensus</span>
          <span className="consensus-val-text">Outperform</span>
        </div>
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View analyst estimates &gt;</button>
      </div>
    </div>
  );
};
