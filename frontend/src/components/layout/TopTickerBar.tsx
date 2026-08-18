import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../api/client';
import './TopTickerBar.css';

interface TickerItem {
  symbol: string;
  value: string;
  change: string;
  isPos: boolean;
}

const FALLBACK_TICKERS: TickerItem[] = [
  { symbol: 'NIFTY 50',   value: '24,154.90', change: '-132.75 (-0.55%)', isPos: false },
  { symbol: 'BANKNIFTY',  value: '57,262.40', change: '-235.40 (-0.41%)', isPos: false },
  { symbol: 'SENSEX',     value: '77,235.46', change: '-492.70 (-0.63%)', isPos: false },
  { symbol: 'RELIANCE',   value: '₹1,322.00', change: '+6.00 (+0.46%)',  isPos: true },
  { symbol: 'TCS',        value: '₹2,280.00', change: '-33.20 (-1.44%)', isPos: false },
  { symbol: 'HDFCBANK',   value: '₹723.00',   change: '-6.00 (-0.82%)',  isPos: false },
  { symbol: 'INFY',       value: '₹1,115.00', change: '-24.90 (-2.18%)', isPos: false },
  { symbol: 'ICICIBANK',  value: '₹1,412.00', change: '-3.20 (-0.23%)',  isPos: false },
  { symbol: 'BHARTIARTL', value: '₹1,934.20', change: '-35.00 (-1.78%)', isPos: false },
];

export const TopTickerBar: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();
  const [tickers, setTickers] = useState<TickerItem[]>(FALLBACK_TICKERS);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchLiveTickers = async () => {
      try {
        const res = await apiClient.get<Array<{
          symbol: string;
          display_symbol?: string;
          price: number;
          change: number;
          change_pct: number;
          currency?: string;
        }>>('/api/v1/market/tickers');

        if (isMounted && res.data && res.data.length > 0) {
          const liveItems: TickerItem[] = res.data.map((item) => {
            const sym = item.display_symbol || item.symbol.replace('.NS', '').replace('.BO', '');
            const prefix = item.currency === 'INR' || !item.currency ? '₹' : '$';
            const formattedPrice = item.price >= 1000
              ? `${prefix}${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : `${prefix}${item.price.toFixed(2)}`;
            const isPositive = item.change >= 0;
            const sign = isPositive ? '+' : '';
            return {
              symbol: sym,
              value: formattedPrice,
              change: `${sign}${item.change.toFixed(2)} (${sign}${item.change_pct.toFixed(2)}%)`,
              isPos: isPositive,
            };
          });
          setTickers(liveItems);
        }
      } catch {
        // Use fallback tickers on network error
      }
    };

    fetchLiveTickers();
    const interval = setInterval(fetchLiveTickers, 15000); // 15s refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  const displayList = tickers.length > 0 ? tickers : FALLBACK_TICKERS;

  return (
    <div className="fs-ticker">
      {/* Scrolling tickers */}
      <div className="fs-ticker__scroll">
        <div className="fs-ticker__track">
          {/* Duplicated for infinite scroll illusion */}
          {[...displayList, ...displayList].map((item, i) => (
            <button
              key={`${item.symbol}-${i}`}
              className="fs-ticker__item"
              onClick={() => {
                if (!['NIFTY 50','SENSEX','BANKNIFTY','NIFTY IT','MIDCAP 100','INDIA VIX','USD/INR'].includes(item.symbol)) {
                  setSelectedSymbol(`${item.symbol}.NS`);
                }
              }}
            >
              <span className="fs-ticker__symbol">{item.symbol}</span>
              <span className="fs-ticker__price">{item.value}</span>
              <span className={`fs-ticker__change ${item.isPos ? 'fs-ticker__change--pos' : 'fs-ticker__change--neg'}`}>
                {item.isPos ? '▲' : '▼'} {item.change}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Market status & time */}
      <div className="fs-ticker__status">
        <span className="fs-ticker__status-dot" />
        <span className="fs-ticker__status-text">NSE · BSE Live</span>
        <span className="fs-ticker__time">{timeStr} IST</span>
      </div>
    </div>
  );
};
