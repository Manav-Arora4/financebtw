import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppStore } from '../store/useAppStore';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedMarket, setSelectedMarket } = useAppStore();
  const [refreshRate, setRefreshRate] = useState('5s');
  const [currency, setCurrency] = useState('INR');

  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'Guest');

  return (
    <div className="terminal-settings-container">
      {/* Top Header */}
      <div className="settings-top-bar">
        <div>
          <h2 className="settings-heading">TERMINAL SETTINGS &amp; PREFERENCES</h2>
          <p className="settings-sub">Customize market feeds, default currencies, refresh rates, and user preferences</p>
        </div>
      </div>

      <div className="settings-grid-split">
        {/* User Profile & Account */}
        <div className="settings-panel">
          <div className="panel-header-line">
            <span className="panel-hdr-title">USER ACCOUNT &amp; IDENTITY</span>
            <span className="status-tag-green">[ACTIVE SESSION]</span>
          </div>

          <div className="settings-fields-list">
            <div className="setting-field-row">
              <span className="field-lbl">DISPLAY USERNAME:</span>
              <span className="field-val bold amber">@{username}</span>
            </div>
            <div className="setting-field-row">
              <span className="field-lbl">EMAIL ADDRESS:</span>
              <span className="field-val">{user ? user.email : 'Guest Session (Sign in to sync)'}</span>
            </div>
            <div className="setting-field-row">
              <span className="field-lbl">SECURITY ROLE:</span>
              <span className="field-val bold">[AUTHENTICATED USER]</span>
            </div>
          </div>
        </div>

        {/* Market Feeds & Data Preferences */}
        <div className="settings-panel">
          <div className="panel-header-line">
            <span className="panel-hdr-title">MARKET FEEDS &amp; DISPLAY</span>
            <span className="status-tag-cyan">[PREFERENCES]</span>
          </div>

          <div className="settings-fields-list">
            <div className="setting-field-row">
              <span className="field-lbl">DEFAULT MARKET:</span>
              <div className="field-controls">
                <button
                  className={`btn-setting-pill ${selectedMarket === 'india' ? 'active' : ''}`}
                  onClick={() => setSelectedMarket('india')}
                >
                  [NSE / BSE]
                </button>
                <button
                  className={`btn-setting-pill ${selectedMarket === 'usa' ? 'active' : ''}`}
                  onClick={() => setSelectedMarket('usa')}
                >
                  [USA / SEC]
                </button>
                <button
                  className={`btn-setting-pill ${selectedMarket === 'crypto' ? 'active' : ''}`}
                  onClick={() => setSelectedMarket('crypto')}
                >
                  [CRYPTO]
                </button>
              </div>
            </div>

            <div className="setting-field-row">
              <span className="field-lbl">FEED REFRESH INTERVAL:</span>
              <div className="field-controls">
                {['1s (Live)', '5s', '15s', '30s'].map((rate) => (
                  <button
                    key={rate}
                    className={`btn-setting-pill ${refreshRate === rate ? 'active' : ''}`}
                    onClick={() => setRefreshRate(rate)}
                  >
                    [{rate}]
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-field-row">
              <span className="field-lbl">BASE CURRENCY:</span>
              <div className="field-controls">
                {['INR (₹)', 'USD ($)', 'EUR (€)'].map((curr) => (
                  <button
                    key={curr}
                    className={`btn-setting-pill ${currency === curr ? 'active' : ''}`}
                    onClick={() => setCurrency(curr)}
                  >
                    [{curr}]
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
