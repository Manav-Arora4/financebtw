import React, { useState } from 'react';

export const FinancialsCard: React.FC = () => {
  const [period, setPeriod] = useState<'annual' | 'quarterly'>('quarterly');

  const quarters = [
    { label: "Q1 '24", revHeight: 90, revY: 55, incHeight: 38, incY: 107, marginY: 60, marginPct: '7.8%' },
    { label: "Q2 '24", revHeight: 96, revY: 49, incHeight: 44, incY: 101, marginY: 54, marginPct: '8.2%' },
    { label: "Q3 '24", revHeight: 88, revY: 57, incHeight: 36, incY: 109, marginY: 64, marginPct: '7.5%' },
    { label: "Q4 '24", revHeight: 102, revY: 43, incHeight: 48, incY: 97, marginY: 48, marginPct: '8.6%' },
    { label: "Q1 '25", revHeight: 108, revY: 37, incHeight: 52, incY: 93, marginY: 42, marginPct: '8.9%' },
  ];

  return (
    <div className="financebtw-card financials-card">
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
        <svg viewBox="0 0 490 180" className="financials-svg-chart" preserveAspectRatio="xMidYMid meet">
          {/* Horizontal Grid Lines */}
          <line x1="45" y1="28" x2="445" y2="28" stroke="#162032" strokeDasharray="4,4" />
          <line x1="45" y1="68" x2="445" y2="68" stroke="#162032" strokeDasharray="4,4" />
          <line x1="45" y1="108" x2="445" y2="108" stroke="#162032" strokeDasharray="4,4" />
          <line x1="45" y1="145" x2="445" y2="145" stroke="#1c273c" />

          {/* Left Y Axis Labels */}
          <text x="8" y="32" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">3L Cr</text>
          <text x="8" y="72" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">2L Cr</text>
          <text x="8" y="112" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">1L Cr</text>
          <text x="24" y="148" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">0</text>

          {/* Right Y Axis Percentage Labels */}
          <text x="452" y="32" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">40%</text>
          <text x="452" y="72" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">20%</text>
          <text x="452" y="148" fill="#64748b" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="600">0%</text>

          {/* Quarter Bars */}
          {quarters.map((q, idx) => {
            const centerX = 88 + idx * 78;
            return (
              <g key={q.label}>
                {/* Quarter Background Backing */}
                <rect
                  x={centerX - 24}
                  y="20"
                  width="48"
                  height="125"
                  fill="#0b111e"
                  rx="4"
                />

                {/* Revenue Bar (Blue) */}
                <rect
                  x={centerX - 20}
                  y={q.revY}
                  width="18"
                  height={q.revHeight}
                  fill="#3b82f6"
                  rx="3"
                />

                {/* Net Income Bar (Teal) */}
                <rect
                  x={centerX + 2}
                  y={q.incY}
                  width="18"
                  height={q.incHeight}
                  fill="#10b981"
                  rx="3"
                />

                {/* X-Axis Quarter Label */}
                <text
                  x={centerX}
                  y="164"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {q.label}
                </text>
              </g>
            );
          })}

          {/* Connecting Profit Margin Polyline */}
          <polyline
            points="88,60 166,54 244,64 322,48 400,42"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Polyline Circular Dots & Data Labels */}
          {quarters.map((q, idx) => {
            const centerX = 88 + idx * 78;
            return (
              <g key={`node-${idx}`}>
                <circle
                  cx={centerX}
                  cy={q.marginY}
                  r="4"
                  fill="#1e40af"
                  stroke="#93c5fd"
                  strokeWidth="2"
                />
                <text
                  x={centerX}
                  y={q.marginY - 8}
                  fill="#93c5fd"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {q.marginPct}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View financial statements &gt;</button>
      </div>
    </div>
  );
};
