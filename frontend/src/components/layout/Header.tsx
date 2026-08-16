import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import { StatusIndicator } from '../ui/StatusIndicator';
import './Header.css';

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const BellIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const AIIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

/* NSE/BSE Indian stocks for quick search suggestions */
const INDIAN_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
  { symbol: 'INFY', name: 'Infosys Ltd.' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
  { symbol: 'ITC', name: 'ITC Ltd.' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
  { symbol: 'WIPRO', name: 'Wipro Ltd.' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.' },
  { symbol: 'TITAN', name: 'Titan Company Ltd.' },
];

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { setSelectedSymbol, setCommandPaletteOpen, aiPanelOpen, toggleAIPanel } = useAppStore();
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'Manav');

  const initials = username.slice(0, 2).toUpperCase();

  const filtered = searchInput.trim()
    ? INDIAN_STOCKS.filter(
        (s) =>
          s.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
          s.name.toLowerCase().includes(searchInput.toLowerCase())
      ).slice(0, 6)
    : INDIAN_STOCKS.slice(0, 5);

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(`${symbol}.NS`);
    setSearchInput('');
    setShowSuggestions(false);
    navigate('/dashboard');
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setShowSuggestions(false); setSearchInput(''); }
    if (e.key === 'Enter' && filtered[0]) handleSelect(filtered[0].symbol);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fs-header">
      {/* Left: Brand */}
      <div className="fs-header__brand" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
        <div className="fs-header__logo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <span className="fs-header__wordmark">FinanceBtw</span>
      </div>

      {/* Center: Global search */}
      <div ref={searchRef} className="fs-header__search-wrap">
        <div
          className="fs-header__search"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <SearchIcon />
          <span className="fs-header__search-placeholder">
            {searchInput || 'Search stocks, pages, actions...'}
          </span>
          <kbd className="fs-header__kbd">Ctrl+K</kbd>
        </div>

        {/* Quick inline search (on focus override) */}
        <input
          className="fs-header__search-input-hidden"
          value={searchInput}
          onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleSearchKey}
          placeholder="Search NSE / BSE stocks..."
          aria-label="Stock search"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && filtered.length > 0 && (
          <div className="fs-header__suggestions">
            <div className="fs-header__suggestions-label">NSE / BSE Stocks</div>
            {filtered.map((s) => (
              <button
                key={s.symbol}
                className="fs-header__suggestion-item"
                onClick={() => handleSelect(s.symbol)}
              >
                <span className="fs-header__suggestion-ticker">{s.symbol}</span>
                <span className="fs-header__suggestion-name">{s.name}</span>
                <span className="fs-header__suggestion-exchange">NSE</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="fs-header__actions">
        {/* Market status */}
        <StatusIndicator status="open" showLabel={true} pulse={true} />

        <div className="fs-header__divider" />

        {/* AI Panel toggle */}
        <button
          className={`fs-header__icon-btn ${aiPanelOpen ? 'fs-header__icon-btn--active' : ''}`}
          onClick={toggleAIPanel}
          title="Toggle Research Copilot (Ctrl+\)"
        >
          <AIIcon />
          <span className="fs-header__icon-label">Copilot</span>
        </button>

        {/* Notifications */}
        <button className="fs-header__icon-btn fs-header__notif-btn" title="Market alerts">
          <BellIcon />
          <span className="fs-header__notif-dot" />
        </button>

        {/* User avatar & menu */}
        <div ref={userMenuRef} className="fs-header__user">
          <button
            className="fs-header__avatar-btn"
            onClick={() => setShowUserMenu((v) => !v)}
          >
            <span className="fs-header__avatar">{initials}</span>
            <span className="fs-header__username">{username}</span>
            <ChevronDownIcon />
          </button>

          {showUserMenu && (
            <div className="fs-header__user-menu">
              <div className="fs-header__user-info">
                <span className="fs-header__user-name">{username}</span>
                <span className="fs-header__user-email">{user?.email ?? 'demo@financ.btw'}</span>
              </div>
              <div className="fs-header__menu-divider" />
              <button className="fs-header__menu-item" onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                Settings
              </button>
              <button className="fs-header__menu-item fs-header__menu-item--danger" onClick={() => signOut?.()}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
