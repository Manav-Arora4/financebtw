import React from 'react';

export const AnalystRatingsCard: React.FC = () => {
  // Radius = 38, strokeWidth = 6. Inner clear radius = 35 (diameter 70).
  // Circumference = 2 * PI * 38 = 238.76
  const circ = 238.76;
  const buyLen = (78 / 100) * circ;
  const holdLen = (19 / 100) * circ;
  const sellLen = (3 / 100) * circ;

  return (
    <div className="finsight-card analyst-ratings-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Analyst Ratings</h3>
      </div>

      <div className="analyst-gauge-and-breakdown">
        {/* SVG Multi-colored Circular Ring Gauge with Vector-Rendered Center Text */}
        <div className="analyst-circle-gauge-wrapper">
          <svg viewBox="0 0 100 100" className="gauge-svg">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#131c2c"
              strokeWidth="6"
            />
            {/* 1. Green Buy Arc (78%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#22c55e"
              strokeWidth="6"
              strokeDasharray={`${buyLen} ${circ - buyLen}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />
            {/* 2. Amber Hold Arc (19%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="6"
              strokeDasharray={`${holdLen} ${circ - holdLen}`}
              strokeDashoffset={`-${buyLen}`}
              transform="rotate(-90 50 50)"
            />
            {/* 3. Red Sell Arc (3%) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#ef4444"
              strokeWidth="6"
              strokeDasharray={`${sellLen} ${circ - sellLen}`}
              strokeDashoffset={`-${buyLen + holdLen}`}
              transform="rotate(-90 50 50)"
            />

            {/* In-SVG Perfectly Proportioned Centered Score & Label */}
            <text
              x="50"
              y="46"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              fontSize="20"
              fontWeight="900"
              fontFamily="Inter, sans-serif"
            >
              4.3
            </text>
            <text
              x="50"
              y="61"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#22c55e"
              fontSize="6.5"
              fontWeight="800"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.4"
            >
              OUTPERFORM
            </text>
          </svg>
        </div>

        {/* Ratings Breakdown List */}
        <div className="ratings-breakdown-list">
          <div className="rating-row">
            <div className="rating-row-label">
              <span className="dot-indicator green"></span>
              <span>Buy</span>
            </div>
            <span className="rating-row-count">28 (78%)</span>
          </div>

          <div className="rating-row">
            <div className="rating-row-label">
              <span className="dot-indicator amber"></span>
              <span>Hold</span>
            </div>
            <span className="rating-row-count">7 (19%)</span>
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
          <span className="target-val-num">₹3,250.00</span>
          <span className="target-upside-text pos">▲ +8.86% Upside</span>
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
