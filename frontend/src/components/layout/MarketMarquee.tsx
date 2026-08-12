import React from 'react';
import { useAppStore, type MarketTicker } from '../../store/useAppStore';

export const MarketMarquee: React.FC = () => {
  const { tickers, setSelectedSymbol } = useAppStore();

  const renderTicker = (item: MarketTicker, index: number) => {
    const isPositive = item.change >= 0;
    return (
      <div
        key={`${item.symbol}-${index}`}
        className="marquee-item"
        onClick={() => setSelectedSymbol(item.symbol)}
        title={`Click to analyze ${item.name}`}
      >
        <span className="marquee-symbol">{item.symbol}</span>
        <span className="marquee-price">
          {item.currency === 'INR' ? '₹' : '$'}
          {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`marquee-badge ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? `[+${item.percent.toFixed(2)}%]` : `[${item.percent.toFixed(2)}%]`}
        </span>
      </div>
    );
  };

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {/* Double array rendering for seamless infinite scrolling */}
        {tickers.map((item, idx) => renderTicker(item, idx))}
        {tickers.map((item, idx) => renderTicker(item, idx + tickers.length))}
      </div>
    </div>
  );
};
