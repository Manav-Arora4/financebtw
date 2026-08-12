import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const TopTickerBar: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();

  const indianIndices = [
    { symbol: 'NIFTY 50', value: '24,734.85', change: '+0.67%', isPos: true },
    { symbol: 'SENSEX', value: '81,330.56', change: '+0.63%', isPos: true },
    { symbol: 'BANK NIFTY', value: '51,248.80', change: '+0.81%', isPos: true },
    { symbol: 'NIFTY IT', value: '38,450.20', change: '+1.12%', isPos: true },
    { symbol: 'INDIA VIX', value: '12.45', change: '-1.35%', isPos: false },
    { symbol: 'USD/INR', value: '83.92', change: '-0.05%', isPos: false },
  ];

  return (
    <div className="top-ticker-ribbon">
      <div className="ticker-items-container">
        {indianIndices.map((idx) => (
          <div
            key={idx.symbol}
            className="ticker-stat-item"
            onClick={() => setSelectedSymbol('RELIANCE.NS')}
          >
            <span className="ticker-label">{idx.symbol}</span>
            <span className="ticker-val">{idx.value}</span>
            <span className={`ticker-delta ${idx.isPos ? 'pos' : 'neg'}`}>
              {idx.isPos ? '▲ ' : '▼ '}
              {idx.change}
            </span>
          </div>
        ))}
      </div>

      <div className="market-session-badge">
        <span className="green-dot"></span>
        <span className="session-text">NSE / BSE Live 09:45:32 IST</span>
      </div>
    </div>
  );
};
