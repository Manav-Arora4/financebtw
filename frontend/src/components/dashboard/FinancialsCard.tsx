import React, { useState } from 'react';

export const FinancialsCard: React.FC = () => {
  const [period, setPeriod] = useState<'annual' | 'quarterly'>('quarterly');

  return (
    <div className="finsight-card financials-card">
      {/* Title & Tabs */}
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Financials (TTM)</h3>
        <div className="period-toggle-pills">
          <button
            className={`period-pill ${period === 'annual' ? 'active' : ''}`}
            onClick={() => setPeriod('annual')}
          >
            Annual
          </button>
          <button
            className={`period-pill ${period === 'quarterly' ? 'active' : ''}`}
            onClick={() => setPeriod('quarterly')}
          >
            Quarterly
          </button>
        </div>
      </div>

      {/* Top 4 Numbers */}
      <div className="financials-numbers-strip">
        <div className="fin-metric-col">
          <span className="fin-lbl">Revenue</span>
          <span className="fin-val">₹10.04L Cr</span>
          <span className="fin-pct pos">▲ +8.2% YoY</span>
        </div>
        <div className="fin-metric-col">
          <span className="fin-lbl">Net Income</span>
          <span className="fin-val">₹79,020 Cr</span>
          <span className="fin-pct pos">▲ +7.5% YoY</span>
        </div>
        <div className="fin-metric-col">
          <span className="fin-lbl">EPS</span>
          <span className="fin-val">₹105.10</span>
          <span className="fin-pct pos">▲ +7.1% YoY</span>
        </div>
        <div className="fin-metric-col">
          <span className="fin-lbl">FCF</span>
          <span className="fin-val">₹48,200 Cr</span>
          <span className="fin-pct pos">▲ +5.4% YoY</span>
        </div>
      </div>

      {/* Legend */}
      <div className="fin-chart-legend">
        <div className="legend-item"><span className="legend-box blue"></span><span>Revenue</span></div>
        <div className="legend-item"><span className="legend-box cyan"></span><span>Net Income</span></div>
        <div className="legend-item"><span className="legend-box green"></span><span>Profit Margin</span></div>
      </div>

      {/* SVG Bar + Line Chart */}
      <div className="fin-svg-chart-wrapper">
        <svg viewBox="0 0 340 100" className="financials-svg-chart">
          {/* Y Axis Grid Lines */}
          <line x1="25" y1="15" x2="335" y2="15" stroke="#182338" strokeDasharray="2,2" />
          <line x1="25" y1="45" x2="335" y2="45" stroke="#182338" strokeDasharray="2,2" />
          <line x1="25" y1="75" x2="335" y2="75" stroke="#182338" strokeDasharray="2,2" />

          <text x="0" y="18" fill="#64748b" fontSize="8">3L Cr</text>
          <text x="0" y="48" fill="#64748b" fontSize="8">2L Cr</text>
          <text x="0" y="78" fill="#64748b" fontSize="8">1L Cr</text>

          {/* Q1 '24 */}
          <rect x="45" y="25" width="12" height="55" fill="#3b82f6" rx={2} />
          <rect x="59" y="55" width="12" height="25" fill="#06b6d4" rx={2} />

          {/* Q2 '24 */}
          <rect x="100" y="20" width="12" height="60" fill="#3b82f6" rx={2} />
          <rect x="114" y="52" width="12" height="28" fill="#06b6d4" rx={2} />

          {/* Q3 '24 */}
          <rect x="155" y="30" width="12" height="50" fill="#3b82f6" rx={2} />
          <rect x="169" y="58" width="12" height="22" fill="#06b6d4" rx={2} />

          {/* Q4 '24 */}
          <rect x="210" y="18" width="12" height="62" fill="#3b82f6" rx={2} />
          <rect x="224" y="48" width="12" height="32" fill="#06b6d4" rx={2} />

          {/* Q1 '25 */}
          <rect x="265" y="15" width="12" height="65" fill="#3b82f6" rx={2} />
          <rect x="279" y="45" width="12" height="35" fill="#06b6d4" rx={2} />

          {/* Profit Margin Polyline (Green) */}
          <polyline
            points="58,50 113,46 168,52 223,44 278,40"
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <circle cx="58" cy="50" r="2.5" fill="#22c55e" />
          <circle cx="113" cy="46" r="2.5" fill="#22c55e" />
          <circle cx="168" cy="52" r="2.5" fill="#22c55e" />
          <circle cx="223" cy="44" r="2.5" fill="#22c55e" />
          <circle cx="278" cy="40" r="2.5" fill="#22c55e" />

          {/* X Axis Labels */}
          <text x="50" y="94" fill="#94a3b8" fontSize="8">Q1 '24</text>
          <text x="105" y="94" fill="#94a3b8" fontSize="8">Q2 '24</text>
          <text x="160" y="94" fill="#94a3b8" fontSize="8">Q3 '24</text>
          <text x="215" y="94" fill="#94a3b8" fontSize="8">Q4 '24</text>
          <text x="270" y="94" fill="#94a3b8" fontSize="8">Q1 '25</text>
        </svg>
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View financial statements &gt;</button>
      </div>
    </div>
  );
};
