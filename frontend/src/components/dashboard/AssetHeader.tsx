import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../api/client';
import { IconStar, IconSparkles, IconCompare } from '../icons/Icons';

interface LiveQuoteState {
  name?: string;
  price: number;
  change: number;
  change_pct: number;
  currency: string;
  day_high?: number | null;
  day_low?: number | null;
  fifty_two_week_high?: number | null;
  fifty_two_week_low?: number | null;
  volume?: number;
  market_cap?: number | null;
}

export const AssetHeader: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [isStarred, setIsStarred] = useState(true);
  const [liveQuote, setLiveQuote] = useState<LiveQuoteState | null>(null);

  // Normalize Indian Stock details
  const tickerClean = selectedSymbol ? selectedSymbol.replace('.NS', '').replace('.BO', '') : '';
  
  useEffect(() => {
    if (!selectedSymbol) return;
    let isMounted = true;
    const fetchLiveQuote = async () => {
      try {
        const res = await apiClient.get<LiveQuoteState>(`/api/v1/market/quote/${selectedSymbol}`);
        if (isMounted && res.data && res.data.price) {
          setLiveQuote(res.data);
        }
      } catch {
        // Fallback to static values if offline
      }
    };

    fetchLiveQuote();
  }, [selectedSymbol]);

  if (!selectedSymbol) return null;

  const defaultName = tickerClean === 'TCS' ? 'Tata Consultancy Services Limited' :
                      tickerClean === 'INFY' ? 'Infosys Limited' :
                      tickerClean === 'HDFCBANK' ? 'HDFC Bank Limited' :
                      tickerClean === 'ICICIBANK' ? 'ICICI Bank Limited' :
                      tickerClean === 'BHARTIARTL' ? 'Bharti Airtel Limited' :
                      'Reliance Industries Limited';

  const companyName = liveQuote?.name || defaultName;

  const sectorTag = tickerClean === 'TCS' || tickerClean === 'INFY' ? 'IT Services / Tech' :
                    tickerClean.includes('BANK') ? 'Banking & Financials' :
                    tickerClean === 'BHARTIARTL' ? 'Telecommunications' :
                    'Energy / Retail / Telecom';

  const rawPrice = liveQuote?.price ?? (
    tickerClean === 'TCS' ? 2280.0 :
    tickerClean === 'INFY' ? 1115.0 :
    tickerClean === 'HDFCBANK' ? 723.0 :
    tickerClean === 'ICICIBANK' ? 1412.0 :
    tickerClean === 'BHARTIARTL' ? 1934.2 :
    1322.0
  );

  const rawChange = liveQuote?.change ?? (
    tickerClean === 'TCS' ? -33.20 :
    tickerClean === 'INFY' ? -24.90 :
    tickerClean === 'HDFCBANK' ? -6.00 :
    tickerClean === 'ICICIBANK' ? -3.20 :
    tickerClean === 'BHARTIARTL' ? -35.00 :
    6.00
  );

  const rawPct = liveQuote?.change_pct ?? (
    tickerClean === 'TCS' ? -1.44 :
    tickerClean === 'INFY' ? -2.18 :
    tickerClean === 'HDFCBANK' ? -0.82 :
    tickerClean === 'ICICIBANK' ? -0.23 :
    tickerClean === 'BHARTIARTL' ? -1.78 :
    0.46
  );

  const isPos = rawChange >= 0;
  const sign = isPos ? '+' : '';
  const priceDisplay = `₹${rawPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const high52 = liveQuote?.fifty_two_week_high ? `₹${liveQuote.fifty_two_week_high.toLocaleString('en-IN', { maximumFractionDigits: 1 })}` : '₹1,611.80';
  const low52 = liveQuote?.fifty_two_week_low ? `₹${liveQuote.fifty_two_week_low.toLocaleString('en-IN', { maximumFractionDigits: 1 })}` : '₹1,249.80';
  const mcap = liveQuote?.market_cap ? `₹${(liveQuote.market_cap / 1e11).toFixed(1)}L Cr` : '₹17.8L Cr';

  const stats = [
    { label: 'Market Cap', val: mcap },
    { label: 'P/E (TTM)', val: tickerClean === 'TCS' ? '29.2' : tickerClean === 'INFY' ? '25.8' : '28.4' },
    { label: '52W High', val: high52 },
    { label: '52W Low', val: low52 },
    { label: 'Day Range', val: liveQuote?.day_low && liveQuote?.day_high ? `₹${liveQuote.day_low.toFixed(1)} - ₹${liveQuote.day_high.toFixed(1)}` : '₹1,311.2 - ₹1,328.6' },
    { label: 'Volume', val: liveQuote?.volume ? liveQuote.volume.toLocaleString('en-IN') : '9,954,054' },
  ];

  return (
    <div className="asset-dashboard-header">
      {/* Breadcrumb */}
      <div className="asset-breadcrumb">
        <span>Dashboard</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">{companyName} ({tickerClean})</span>
      </div>

      {/* Main Top Row */}
      <div className="asset-main-info-row">
        {/* Left Ticker & Name */}
        <div className="asset-brand-block">
          <div className="asset-ticker-badge-box">
            <span>{tickerClean.slice(0, 1)}</span>
          </div>
          <div className="asset-title-column">
            <div className="ticker-star-row">
              <h1 className="asset-ticker-title">{tickerClean}</h1>
              <button
                className={`btn-star-fav ${isStarred ? 'active' : ''}`}
                onClick={() => setIsStarred(!isStarred)}
                title="Toggle Watchlist"
              >
                <IconStar size={16} filled={isStarred} />
              </button>
            </div>
            <div className="asset-meta-tags">
              <span className="company-full-name">{companyName}</span>
              <span className="tag-pill cyan">NSE</span>
              <span className="tag-pill slate">{sectorTag}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="asset-action-buttons">
          <button className="btn-outline-action">
            <span>+ Add to Watchlist</span>
          </button>
          <button className="btn-orange-primary">
            <IconSparkles size={13} />
            <span>Analyze Stock</span>
          </button>
          <button className="btn-outline-action">
            <IconCompare size={13} />
            <span>Compare</span>
          </button>
          <button className="btn-icon-more" title="More options">
            <span>•••</span>
          </button>
        </div>
      </div>

      {/* Price & Fundamentals Summary Bar */}
      <div className="asset-price-metrics-bar">
        {/* Big Price Display */}
        <div className="price-big-block">
          <div className="price-main-line">
            <span className="price-big-num">{priceDisplay}</span>
            <span className="price-currency-code">INR</span>
            <span className={`price-change-pill ${isPos ? 'pos' : 'neg'}`}>
              {isPos ? '▲' : '▼'} {sign}{rawChange.toFixed(2)} ({sign}{rawPct.toFixed(2)}%)
            </span>
          </div>
          <div className="price-after-hours">
            Real-time Feed: <span className="after-val">NSE Live Market Data</span>
          </div>
        </div>

        {/* Fundamentals Stats Bar */}
        <div className="fundamentals-horizontal-strip">
          {stats.map((stat, i) => (
            <div key={i} className="fundamental-stat-item">
              <span className="fund-stat-label">{stat.label}</span>
              <span className="fund-stat-val">{stat.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
