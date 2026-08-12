import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { IconStar, IconSparkles, IconCompare } from '../icons/Icons';

export const AssetHeader: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [isStarred, setIsStarred] = useState(true);

  // Normalize Indian Stock details
  const tickerClean = selectedSymbol.replace('.NS', '').replace('.BO', '');
  const companyName = tickerClean === 'TCS' ? 'Tata Consultancy Services' :
                      tickerClean === 'INFY' ? 'Infosys Limited' :
                      tickerClean === 'HDFCBANK' ? 'HDFC Bank Limited' :
                      tickerClean === 'ICICIBANK' ? 'ICICI Bank Limited' :
                      'Reliance Industries Ltd.';
  const sectorTag = tickerClean === 'TCS' || tickerClean === 'INFY' ? 'IT Services / Tech' :
                    tickerClean.includes('BANK') ? 'Banking & Financials' :
                    'Energy / Retail / Telecom';

  const price = tickerClean === 'TCS' ? '₹4,190.00' :
                tickerClean === 'INFY' ? '₹1,875.40' :
                tickerClean === 'HDFCBANK' ? '₹1,645.20' :
                '₹2,985.50';

  const stats = [
    { label: 'Market Cap', val: '₹20.2L Cr' },
    { label: 'P/E (TTM)', val: '28.42' },
    { label: 'EPS (TTM)', val: '₹105.10' },
    { label: 'Dividend Yield', val: '0.35%' },
    { label: '52W High', val: '₹3,217.90' },
    { label: '52W Low', val: '₹2,220.30' },
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
            <span className="price-big-num">{price}</span>
            <span className="price-currency-code">INR</span>
            <span className="price-change-pill pos">▲ +32.10 (1.09%)</span>
          </div>
          <div className="price-after-hours">
            Pre-Open: <span className="after-val">2,988.00 ▲ +2.50 (+0.08%)</span>
          </div>
        </div>

        {/* Fundamental Statistics Columns */}
        <div className="fundamentals-horizontal-strip">
          {stats.map((st) => (
            <div key={st.label} className="fundamental-stat-item">
              <span className="fund-stat-label">{st.label}</span>
              <span className="fund-stat-val">{st.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
