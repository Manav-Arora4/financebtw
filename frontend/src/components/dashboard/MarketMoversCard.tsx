import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const MarketMoversCard: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();
  const [tab, setTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

  const movers = [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', change: '+5.32%', price: '841.23', isPos: true },
    { symbol: 'META', name: 'Meta Platforms Inc.', change: '+3.21%', price: '502.31', isPos: true },
    { symbol: 'TSLA', name: 'Tesla Inc.', change: '+2.87%', price: '182.63', isPos: true },
    { symbol: 'AAPL', name: 'Apple Inc.', change: '+1.25%', price: '195.83', isPos: true },
    { symbol: 'MSFT', name: 'Microsoft Corp.', change: '+1.18%', price: '421.18', isPos: true },
  ];

  return (
    <div className="finsight-card market-movers-card">
      {/* Title & Tabs */}
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Market Movers</h3>
      </div>

      <div className="movers-tab-pills">
        <button
          className={`mover-tab-btn ${tab === 'gainers' ? 'active' : ''}`}
          onClick={() => setTab('gainers')}
        >
          Gainers
        </button>
        <button
          className={`mover-tab-btn ${tab === 'losers' ? 'active' : ''}`}
          onClick={() => setTab('losers')}
        >
          Losers
        </button>
        <button
          className={`mover-tab-btn ${tab === 'active' ? 'active' : ''}`}
          onClick={() => setTab('active')}
        >
          Most Active
        </button>
      </div>

      {/* Movers List */}
      <div className="movers-items-list">
        {movers.map((m) => (
          <div
            key={m.symbol}
            className="mover-row-item"
            onClick={() => setSelectedSymbol(m.symbol)}
          >
            <div className="mover-identity-col">
              <span className="mover-symbol-code">{m.symbol}</span>
              <span className="mover-company-name">{m.name}</span>
            </div>
            <div className="mover-numbers-col">
              <span className={`mover-change-text ${m.isPos ? 'pos' : 'neg'}`}>
                {m.change}
              </span>
              <span className="mover-last-price">{m.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View all market movers &gt;</button>
      </div>
    </div>
  );
};
