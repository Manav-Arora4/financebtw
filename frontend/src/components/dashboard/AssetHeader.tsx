import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const AssetHeader: React.FC = () => {
  const { selectedSymbol } = useAppStore();

  const isNse = selectedSymbol.includes('.NS') || selectedSymbol.includes('RELIANCE');
  const companyName = isNse ? 'Reliance Industries Ltd.' : 'Apple Inc.';
  const tickerClean = selectedSymbol.replace('.NS', '');
  const exchangeTag = isNse ? 'NSE' : 'NASDAQ';
  const sectorTag = isNse ? 'Energy / Retail' : 'Technology';
  const price = isNse ? '₹2,985.50' : '$195.83';
  const currency = isNse ? 'INR' : 'USD';
  const change = isNse ? '+32.10 (+1.09%)' : '+2.42 (+1.25%)';
  const afterHours = isNse ? '2,988.00 ▲ +2.50 (+0.08%)' : '196.21 ▲ +0.38 (+0.19%)';

  const stats = [
    { label: 'Market Cap', val: isNse ? '₹20.2T' : '$3.01T' },
    { label: 'P/E (TTM)', val: '28.42' },
    { label: 'EPS (TTM)', val: isNse ? '₹105.10' : '6.89' },
    { label: 'Dividend Yield', val: '0.48%' },
    { label: '52W High', val: isNse ? '₹3,217.90' : '199.62' },
    { label: '52W Low', val: isNse ? '₹2,220.30' : '164.08' },
  ];

  return (
    <div className="asset-dashboard-header">
      {/* Breadcrumb */}
      <div className="asset-breadcrumb">
        <span>Dashboard</span>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-active">{companyName} ({selectedSymbol})</span>
      </div>

      {/* Main Top Row */}
      <div className="asset-main-info-row">
        {/* Left Ticker & Name */}
        <div className="asset-brand-block">
          <div className="asset-logo-icon">
            <span>[#]</span>
          </div>
          <div className="asset-title-column">
            <div className="ticker-star-row">
              <h1 className="asset-ticker-title">{tickerClean}</h1>
              <button className="btn-star-fav" title="Add to Watchlist">[*]</button>
            </div>
            <div className="asset-meta-tags">
              <span className="company-full-name">{companyName}</span>
              <span className="tag-pill cyan">{exchangeTag}</span>
              <span className="tag-pill slate">{sectorTag}</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="asset-action-buttons">
          <button className="btn-outline-action">[+] Add to Watchlist</button>
          <button className="btn-orange-primary">Analyze Stock</button>
          <button className="btn-outline-action">Compare</button>
          <button className="btn-icon-more">[::]</button>
        </div>
      </div>

      {/* Price & Fundamentals Summary Bar */}
      <div className="asset-price-metrics-bar">
        {/* Big Price Display */}
        <div className="price-big-block">
          <div className="price-main-line">
            <span className="price-big-num">{price}</span>
            <span className="price-currency-code">{currency}</span>
            <span className="price-change-pill pos">▲ {change}</span>
          </div>
          <div className="price-after-hours">
            After Hours: <span className="after-val">{afterHours}</span>
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
