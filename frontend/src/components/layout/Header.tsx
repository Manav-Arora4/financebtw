import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { selectedMarket, setSelectedMarket, searchQuery, setSearchQuery, openAuthModal } = useAppStore();

  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'User');

  return (
    <header className="app-header">
      {/* Search Input Bar */}
      <div className="header-search">
        <span className="search-icon">[?]</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search Indian stocks (e.g. RELIANCE, TCS, INFY), SEC filings, or news... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Market Selector Pill Switcher */}
      <div className="market-switcher">
        <button
          className={`market-pill ${selectedMarket === 'india' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('india')}
          title="Indian Markets (NSE / BSE / SEBI)"
        >
          [INDIA / NSE]
        </button>
        <button
          className={`market-pill ${selectedMarket === 'usa' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('usa')}
          title="US Markets (SEC 10-K / FMP)"
        >
          [USA / SEC]
        </button>
        <button
          className={`market-pill ${selectedMarket === 'crypto' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('crypto')}
          title="Crypto Universe (24H)"
        >
          [CRYPTO]
        </button>
      </div>

      {/* User Auth Section */}
      <div className="header-actions">
        {user ? (
          <div className="user-profile-menu">
            <span className="user-avatar-tag">[@]</span>
            <div className="user-info-text">
              <span className="user-email">{username}</span>
              <span className="user-role">[{user.role || 'authenticated'}]</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => signOut()}
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={openAuthModal}>
            [+] Sign In / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};
