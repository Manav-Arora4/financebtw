import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const TopTickerBar: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();

  const indices = [
    { symbol: 'NIFTY 50', value: '24,734.85', change: '+0.67%', isPos: true },
    { symbol: 'SENSEX', value: '81,330.56', change: '+0.63%', isPos: true },
    { symbol: 'NASDAQ', value: '16,388.24', change: '+0.64%', isPos: true },
    { symbol: 'S&P 500', value: '5,241.53', change: '+0.47%', isPos: true },
    { symbol: 'DOW JONES', value: '39,069.23', change: '-0.22%', isPos: false },
    { symbol: 'VIX', value: '12.45', change: '-1.35%', isPos: false },
  ];

  return (
    <div className="top-ticker-ribbon">
      <div className="ticker-items-container">
        {indices.map((idx) => (
          <div
            key={idx.symbol}
            className="ticker-stat-item"
            onClick={() => setSelectedSymbol(idx.symbol.includes('NIFTY') ? 'RELIANCE.NS' : 'AAPL')}
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
        <span className="session-text">Global Markets Open 09:45:32 IST</span>
      </div>
    </div>
  );
};
