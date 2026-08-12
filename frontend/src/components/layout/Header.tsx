import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';
import { IconSearch, IconBell, IconDashboard } from '../icons/Icons';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { setSelectedSymbol, openAuthModal } = useAppStore();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const ticker = query.includes('.') ? query : `${query}`;
    setSelectedSymbol(ticker);
    setSearchInput('');
  };

  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'Manav Arora');

  return (
    <header className="finsight-header">
      {/* Brand Logo */}
      <div className="header-brand">
        <div className="brand-logo-icon">
          <IconDashboard size={18} />
        </div>
        <span className="brand-title-text">FinanceBtw</span>
      </div>

      {/* Global Search Bar */}
      <form className="header-search-bar" onSubmit={handleSearchSubmit}>
        <IconSearch size={16} className="search-icon-svg" />
        <input
          type="text"
          className="search-input-field"
          placeholder="Search for stocks, ETFs, companies, news, filings, metrics..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <span className="search-kbd-shortcut">Ctrl+K</span>
      </form>

      {/* Header Right Actions */}
      <div className="header-right-actions">
        <button className="header-icon-action-btn" title="Search">
          <IconSearch size={16} />
        </button>

        {/* Notification Bell */}
        <div className="notification-bell-btn" title="12 New Market Alerts">
          <IconBell size={16} />
          <span className="notif-badge-count">12</span>
        </div>

        {/* User Profile */}
        {user ? (
          <div className="user-profile-badge" onClick={() => signOut()} title="Click to Sign Out">
            <div className="avatar-circle">
              <span>{username.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="user-text-column">
              <span className="user-name-title">{username}</span>
              <span className="user-role-subtitle">Professional</span>
            </div>
          </div>
        ) : (
          <button className="btn-signin-header" onClick={openAuthModal}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
