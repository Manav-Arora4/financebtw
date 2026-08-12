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
        <div className="legend-item"><span className="legend-box teal"></span><span>Net Income</span></div>
        <div className="legend-item"><span className="legend-line-icon"></span><span>Profit Margin</span></div>
      </div>

      {/* Large SVG Dual Bar + Polyline Chart */}
      <div className="fin-svg-chart-wrapper">
        <svg viewBox="0 0 380 130" className="financials-svg-chart" preserveAspectRatio="none">
          {/* Horizontal Grid Lines */}
          <line x1="32" y1="20" x2="348" y2="20" stroke="#151e2e" strokeDasharray="3,3" />
          <line x1="32" y1="55" x2="348" y2="55" stroke="#151e2e" strokeDasharray="3,3" />
          <line x1="32" y1="90" x2="348" y2="90" stroke="#151e2e" strokeDasharray="3,3" />

          {/* Left Y Axis Labels */}
          <text x="5" y="24" fill="#64748b" fontSize="8" fontFamily="Inter">3L Cr</text>
          <text x="5" y="59" fill="#64748b" fontSize="8" fontFamily="Inter">2L Cr</text>
          <text x="5" y="94" fill="#64748b" fontSize="8" fontFamily="Inter">1L Cr</text>
          <text x="18" y="112" fill="#64748b" fontSize="8" fontFamily="Inter">0</text>

          {/* Right Y Axis Percentage Labels */}
          <text x="354" y="24" fill="#64748b" fontSize="8" fontFamily="Inter">40%</text>
          <text x="354" y="59" fill="#64748b" fontSize="8" fontFamily="Inter">20%</text>
          <text x="354" y="112" fill="#64748b" fontSize="8" fontFamily="Inter">0%</text>

          {/* Quarter 1 (Q1 '24) */}
          <rect x="52" y="15" width="38" height="95" fill="#0b101c" rx={2} />
          <rect x="56" y="28" width="14" height="82" fill="#3b82f6" rx={2} />
          <rect x="72" y="74" width="14" height="36" fill="#10b981" rx={2} />

          {/* Quarter 2 (Q2 '24) */}
          <rect x="114" y="15" width="38" height="95" fill="#0b101c" rx={2} />
          <rect x="118" y="24" width="14" height="86" fill="#3b82f6" rx={2} />
          <rect x="134" y="70" width="14" height="40" fill="#10b981" rx={2} />

          {/* Quarter 3 (Q3 '24) */}
          <rect x="176" y="15" width="38" height="95" fill="#0b101c" rx={2} />
          <rect x="180" y="32" width="14" height="78" fill="#3b82f6" rx={2} />
          <rect x="196" y="76" width="14" height="34" fill="#10b981" rx={2} />

          {/* Quarter 4 (Q4 '24) */}
          <rect x="238" y="15" width="38" height="95" fill="#0b101c" rx={2} />
          <rect x="242" y="20" width="14" height="90" fill="#3b82f6" rx={2} />
          <rect x="258" y="65" width="14" height="45" fill="#10b981" rx={2} />

          {/* Quarter 5 (Q1 '25) */}
          <rect x="300" y="15" width="38" height="95" fill="#0b101c" rx={2} />
          <rect x="304" y="16" width="14" height="94" fill="#3b82f6" rx={2} />
          <rect x="320" y="60" width="14" height="50" fill="#10b981" rx={2} />

          {/* Connecting Profit Margin Polyline (Blue/Cyan) */}
          <polyline
            points="71,45 133,52 195,58 257,54 319,62"
            fill="none"
            stroke="#2563eb"
            strokeWidth={2}
          />
          <circle cx="71" cy="45" r="3" fill="#3b82f6" />
          <circle cx="133" cy="52" r="3" fill="#3b82f6" />
          <circle cx="195" cy="58" r="3" fill="#3b82f6" />
          <circle cx="257" cy="54" r="3" fill="#3b82f6" />
          <circle cx="319" cy="62" r="3" fill="#3b82f6" />

          {/* X Axis Labels */}
          <text x="60" y="124" fill="#94a3b8" fontSize="8.5" fontFamily="Inter">Q1 '24</text>
          <text x="122" y="124" fill="#94a3b8" fontSize="8.5" fontFamily="Inter">Q2 '24</text>
          <text x="184" y="124" fill="#94a3b8" fontSize="8.5" fontFamily="Inter">Q3 '24</text>
          <text x="246" y="124" fill="#94a3b8" fontSize="8.5" fontFamily="Inter">Q4 '24</text>
          <text x="308" y="124" fill="#94a3b8" fontSize="8.5" fontFamily="Inter">Q1 '25</text>
        </svg>
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View financial statements &gt;</button>
      </div>
    </div>
  );
};
