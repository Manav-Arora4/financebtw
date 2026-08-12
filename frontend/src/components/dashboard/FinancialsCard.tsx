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
          <span className="fin-val">$383.3B</span>
          <span className="fin-pct pos">▲ +2.1% YoY</span>
        </div>
        <div className="fin-metric-col">
          <span className="fin-lbl">Net Income</span>
          <span className="fin-val">$96.99B</span>
          <span className="fin-pct pos">▲ +11.9% YoY</span>
        </div>
        <div className="fin-metric-col">
          <span className="fin-lbl">EPS</span>
          <span className="fin-val">$6.89</span>
          <span className="fin-pct pos">▲ +13.1% YoY</span>
        </div>
        <div className="fin-metric-col">
          <span className="fin-lbl">FCF</span>
          <span className="fin-val">$110.5B</span>
          <span className="fin-pct pos">▲ +4.2% YoY</span>
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
        <svg viewBox="0 0 360 140" className="financials-svg-chart">
          {/* Y Axis Grid Lines */}
          <line x1="30" y1="20" x2="350" y2="20" stroke="#1c2538" strokeDasharray="2,2" />
          <line x1="30" y1="60" x2="350" y2="60" stroke="#1c2538" strokeDasharray="2,2" />
          <line x1="30" y1="100" x2="350" y2="100" stroke="#1c2538" strokeDasharray="2,2" />

          <text x="5" y="24" fill="#64748b" fontSize="9">150B</text>
          <text x="5" y="64" fill="#64748b" fontSize="9">100B</text>
          <text x="5" y="104" fill="#64748b" fontSize="9">50B</text>

          {/* Q1 '23 */}
          <rect x="55" y="40" width="14" height="70" fill="#3b82f6" rx={2} />
          <rect x="71" y="80" width="14" height="30" fill="#06b6d4" rx={2} />

          {/* Q2 '23 */}
          <rect x="115" y="30" width="14" height="80" fill="#3b82f6" rx={2} />
          <rect x="131" y="75" width="14" height="35" fill="#06b6d4" rx={2} />

          {/* Q3 '23 */}
          <rect x="175" y="45" width="14" height="65" fill="#3b82f6" rx={2} />
          <rect x="191" y="85" width="14" height="25" fill="#06b6d4" rx={2} />

          {/* Q4 '23 */}
          <rect x="235" y="35" width="14" height="75" fill="#3b82f6" rx={2} />
          <rect x="251" y="78" width="14" height="32" fill="#06b6d4" rx={2} />

          {/* Q1 '24 */}
          <rect x="295" y="25" width="14" height="85" fill="#3b82f6" rx={2} />
          <rect x="311" y="70" width="14" height="40" fill="#06b6d4" rx={2} />

          {/* Profit Margin Polyline (Green) */}
          <polyline
            points="71,70 131,65 191,72 251,68 311,60"
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <circle cx="71" cy="70" r="3" fill="#22c55e" />
          <circle cx="131" cy="65" r="3" fill="#22c55e" />
          <circle cx="191" cy="72" r="3" fill="#22c55e" />
          <circle cx="251" cy="68" r="3" fill="#22c55e" />
          <circle cx="311" cy="60" r="3" fill="#22c55e" />

          {/* X Axis Labels */}
          <text x="60" y="125" fill="#94a3b8" fontSize="9">Q1 '23</text>
          <text x="120" y="125" fill="#94a3b8" fontSize="9">Q2 '23</text>
          <text x="180" y="125" fill="#94a3b8" fontSize="9">Q3 '23</text>
          <text x="240" y="125" fill="#94a3b8" fontSize="9">Q4 '23</text>
          <text x="300" y="125" fill="#94a3b8" fontSize="9">Q1 '24</text>
        </svg>
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View financial statements &gt;</button>
      </div>
    </div>
  );
};
