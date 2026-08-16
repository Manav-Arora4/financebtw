import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './TopTickerBar.css';

interface TickerItem {
  symbol: string;
  value: string;
  change: string;
  isPos: boolean;
}

const BASE_TICKERS: TickerItem[] = [
  { symbol: 'NIFTY 50',   value: '24,734.85', change: '+165.40 (+0.67%)', isPos: true },
  { symbol: 'SENSEX',     value: '81,330.56', change: '+510.10 (+0.63%)', isPos: true },
  { symbol: 'BANKNIFTY',  value: '51,248.80', change: '+410.20 (+0.81%)', isPos: true },
  { symbol: 'NIFTY IT',   value: '38,450.20', change: '+425.30 (+1.12%)', isPos: true },
  { symbol: 'MIDCAP 100', value: '52,180.40', change: '+180.50 (+0.35%)', isPos: true },
  { symbol: 'INDIA VIX',  value: '12.45',     change: '-0.17 (-1.35%)',   isPos: false },
  { symbol: 'USD/INR',    value: '83.92',     change: '-0.04 (-0.05%)',   isPos: false },
  { symbol: 'RELIANCE',   value: '₹2,985.50', change: '+32.10 (+1.09%)', isPos: true },
  { symbol: 'TCS',        value: '₹4,190.00', change: '+60.00 (+1.45%)', isPos: true },
  { symbol: 'HDFCBANK',   value: '₹1,645.20', change: '+29.50 (+1.82%)', isPos: true },
];

export const TopTickerBar: React.FC = () => {
  const { setSelectedSymbol } = useAppStore();
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  return (
    <div className="fs-ticker">
      {/* Scrolling tickers */}
      <div className="fs-ticker__scroll">
        <div className="fs-ticker__track">
          {/* Duplicated for infinite scroll illusion */}
          {[...BASE_TICKERS, ...BASE_TICKERS].map((item, i) => (
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
