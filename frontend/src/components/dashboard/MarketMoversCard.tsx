import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../api/client';

interface LiveTicker {
  symbol: string;
  display_symbol?: string;
  name: string;
  price: number;
  change: number;
  change_pct: number;
  currency?: string;
}

export const MarketMoversCard: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();
  const [tab, setTab] = useState<'gainers' | 'losers' | 'active'>('gainers');
  const [tickers, setTickers] = useState<LiveTicker[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiClient
      .get<LiveTicker[]>('/api/v1/market/tickers')
      .then((res) => {
        if (isMounted && res.data) {
          setTickers(res.data);
        }
      })
      .catch(() => {
        if (isMounted) setTickers([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter only equities (exclude index benchmarks starting with ^)
  const equityTickers = tickers.filter((t) => !t.symbol.startsWith('^'));

  let displayed = [...equityTickers];
  if (tab === 'gainers') {
    displayed.sort((a, b) => b.change_pct - a.change_pct);
  } else if (tab === 'losers') {
    displayed.sort((a, b) => a.change_pct - b.change_pct);
  } else {
    displayed.sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));
  }

  return (
    <div className="financebtw-card market-movers-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Market Movers</h3>
        <span className="card-sub-badge">Live Exchange Feed</span>
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
          Volatile
        </button>
      </div>

      {loading ? (
        <div className="card-loading-state">
          <div className="card-loading-spinner" />
          <span>Streaming market movers...</span>
        </div>
      ) : displayed.length === 0 ? (
        <div className="card-notice-empty">
          <span>No active movers data received from feed.</span>
        </div>
      ) : (
        <div className="movers-items-list">
          {displayed.slice(0, 5).map((m) => {
            const sym = m.display_symbol || m.symbol.replace('.NS', '').replace('.BO', '');
            const isPos = m.change >= 0;
            const sign = isPos ? '+' : '';
            return (
              <div
                key={m.symbol}
                className="mover-row-item clickable"
                onClick={() => setSelectedSymbol(m.symbol)}
              >
                <div className="mover-identity-col">
                  <span className="mover-symbol-code">{sym}</span>
                  <span className="mover-company-name">{m.name}</span>
                </div>
                <div className="mover-numbers-col">
                  <span className={`mover-change-text ${isPos ? 'pos' : 'neg'}`}>
                    {sign}{m.change_pct.toFixed(2)}%
                  </span>
                  <span className="mover-last-price">
                    ₹{m.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
