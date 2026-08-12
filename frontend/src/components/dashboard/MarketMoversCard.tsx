import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const MarketMoversCard: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();
  const [tab, setTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

  const indianMovers = [
    { symbol: 'INFY', name: 'Infosys Limited', change: '+2.15%', price: '₹1,875.40', isPos: true },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', change: '+1.82%', price: '₹1,645.20', isPos: true },
    { symbol: 'TCS', name: 'Tata Consultancy Services', change: '+1.45%', price: '₹4,190.00', isPos: true },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', change: '+1.30%', price: '₹1,460.00', isPos: true },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', change: '+0.95%', price: '₹1,180.50', isPos: true },
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

      {/* Movers List - Guaranteed Left Aligned */}
      <div className="movers-items-list">
        {indianMovers.map((m) => (
          <div
            key={m.symbol}
            className="mover-row-item"
            onClick={() => setSelectedSymbol(`${m.symbol}.NS`)}
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
