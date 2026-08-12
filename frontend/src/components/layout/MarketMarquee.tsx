import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const MarketMarquee: React.FC = () => {
  const { tickers, setSelectedSymbol } = useAppStore();
  // Duplicate array for smooth continuous horizontal scroll
  const marqueeItems = [...tickers, ...tickers];

  return (
    <div className="terminal-marquee-strip">
      <div className="marquee-prefix-label">
        <span className="live-pulse"></span>
        <span className="prefix-txt">LIVE WIRE // REALTIME FEEDS:</span>
      </div>
      <div className="terminal-marquee-track">
        {marqueeItems.map((item, idx) => {
          const isPos = item.change >= 0;
          const formattedPrice =
            item.currency === 'INR'
              ? `₹${item.price.toLocaleString('en-IN')}`
              : `$${item.price.toLocaleString('en-US')}`;
          const formattedPct = `${isPos ? '+' : ''}${item.percent.toFixed(2)}%`;

          return (
            <div
              key={`${item.symbol}-${idx}`}
              className="terminal-marquee-item"
              onClick={() => setSelectedSymbol(item.symbol)}
              title={`Select ${item.symbol} as active target`}
            >
              <span className="m-symbol">{item.symbol}</span>
              <span className="m-price">{formattedPrice}</span>
              <span className={`m-badge ${isPos ? 'pos' : 'neg'}`}>
                {isPos ? `[▲ ${formattedPct}]` : `[▼ ${formattedPct}]`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
