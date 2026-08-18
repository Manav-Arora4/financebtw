import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { IconSparkles, IconSearch } from '../icons/Icons';
import './CompanySelector.css';

interface QuickStock {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
}

const POPULAR_STOCKS: QuickStock[] = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', sector: 'Energy & Retail', exchange: 'NSE' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT Services', exchange: 'NSE' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', sector: 'Banking & Finance', exchange: 'NSE' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', sector: 'IT Services', exchange: 'NSE' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited', sector: 'Banking & Finance', exchange: 'NSE' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Limited', sector: 'Telecom', exchange: 'NSE' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Public Sector Banking', exchange: 'NSE' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Limited', sector: 'Automobiles', exchange: 'NSE' },
  { symbol: 'ITC.NS', name: 'ITC Limited', sector: 'FMCG / Tobacco', exchange: 'NSE' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.', sector: 'Infrastructure', exchange: 'NSE' },
];

export const CompanySelector: React.FC = () => {
  const { setSelectedSymbol, addTrackedSymbol } = useAppStore();
  const [customInput, setCustomInput] = useState('');

  const handleSelect = (sym: string) => {
    addTrackedSymbol(sym);
    setSelectedSymbol(sym);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    let sym = customInput.trim().toUpperCase();
    if (!sym.includes('.')) {
      sym = `${sym}.NS`;
    }
    handleSelect(sym);
    setCustomInput('');
  };

  const filtered = POPULAR_STOCKS.filter((s) => {
    const q = customInput.toLowerCase().trim();
    return !q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.sector.toLowerCase().includes(q);
  });

  return (
    <div className="company-selector-hero">
      <div className="selector-header-block">
        <div className="selector-badge-tag">
          <IconSparkles size={13} />
          <span>Real-time Market Telemetry</span>
        </div>
        <h1 className="selector-main-title">Institutional Equities Workstation</h1>
        <p className="selector-sub-text">
          Select or add an Indian equity (NSE / BSE) to load live market prices, interactive OHLCV candlestick charts, DuPont ratios, and verified corporate news.
        </p>
      </div>

      {/* Direct Search Bar */}
      <form className="selector-search-box" onSubmit={handleCustomSubmit}>
        <IconSearch size={18} />
        <input
          type="text"
          placeholder="Search by company name or ticker (e.g. TCS, INFY, RELIANCE, HDFCBANK)..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="selector-search-input"
          autoFocus
        />
        <button type="submit" className="btn-selector-submit">
          Load Telemetry
        </button>
      </form>

      {/* Suggested Bluechips Section */}
      <div className="selector-suggestions-section">
        <div className="selector-section-title-row">
          <span className="selector-section-heading">Featured Indian Equities</span>
          <span className="selector-section-hint">Click any company to open live dashboard</span>
        </div>

        <div className="selector-stocks-grid">
          {filtered.map((stock) => {
            const tickerClean = stock.symbol.replace('.NS', '').replace('.BO', '');
            return (
              <button
                key={stock.symbol}
                className="selector-stock-card"
                onClick={() => handleSelect(stock.symbol)}
              >
                <div className="stock-card-top">
                  <div className="stock-card-avatar">{tickerClean.slice(0, 1)}</div>
                  <div className="stock-card-title-group">
                    <span className="stock-card-symbol">{tickerClean}</span>
                    <span className="stock-card-exchange">{stock.exchange}</span>
                  </div>
                  <span className="stock-card-arrow">→</span>
                </div>
                <div className="stock-card-name">{stock.name}</div>
                <div className="stock-card-footer">
                  <span className="stock-card-sector">{stock.sector}</span>
                  <span className="stock-card-action">View Telemetry</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
