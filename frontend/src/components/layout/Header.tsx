import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { selectedMarket, setSelectedMarket, selectedSymbol, setSelectedSymbol, openAuthModal } = useAppStore();
  const [commandInput, setCommandInput] = useState('');
  const navigate = useNavigate();

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toUpperCase();
    if (!cmd) return;

    if (cmd === 'HELP' || cmd === 'DES') {
      navigate('/overview');
    } else if (cmd === 'GP' || cmd === 'MKT' || cmd === 'QUOTE') {
      navigate('/market');
    } else if (cmd === 'AI' || cmd === 'CHAT') {
      navigate('/chat');
    } else if (cmd === 'RAG' || cmd === 'DOCS' || cmd === 'FILINGS') {
      navigate('/documents');
    } else if (cmd === 'PORT' || cmd === 'RISK') {
      navigate('/portfolio');
    } else if (cmd === 'CFG' || cmd === 'SETTINGS') {
      navigate('/settings');
    } else {
      // Treat input as a stock ticker
      const ticker = cmd.includes('.') ? cmd : `${cmd}.NS`;
      setSelectedSymbol(ticker);
      navigate('/market');
    }
    setCommandInput('');
  };

  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'GUEST');

  return (
    <header className="terminal-header">
      {/* Bloomberg Amber Command Line Prompt */}
      <form className="terminal-command-bar" onSubmit={handleCommandSubmit}>
        <span className="cmd-prompt">FB&gt;</span>
        <input
          type="text"
          className="cmd-input"
          placeholder={`ENTER TICKER OR FUNCTION (e.g. RELIANCE, TCS, INFY, GP, AI, PORT) <GO>`}
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
        />
        <button type="submit" className="btn-cmd-go">
          &lt;GO&gt;
        </button>
      </form>

      {/* Active Asset Badge */}
      <div className="active-ticker-pill" onClick={() => navigate('/market')}>
        <span className="ticker-label">SECURITIES:</span>
        <span className="ticker-value">{selectedSymbol} &lt;EQUITY&gt;</span>
      </div>

      {/* Market Universe Switcher */}
      <div className="terminal-market-switcher">
        <button
          className={`term-market-btn ${selectedMarket === 'india' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('india')}
          title="Indian Markets (NSE / BSE / SEBI)"
        >
          [NSE/BSE]
        </button>
        <button
          className={`term-market-btn ${selectedMarket === 'usa' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('usa')}
          title="US Markets (SEC / NYSE / NASDAQ)"
        >
          [US SEC]
        </button>
        <button
          className={`term-market-btn ${selectedMarket === 'crypto' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('crypto')}
          title="Crypto Universe 24/7"
        >
          [CRYPTO]
        </button>
      </div>

      {/* User Session & Telemetry */}
      <div className="terminal-user-badge">
        {user ? (
          <div className="user-terminal-session">
            <span className="user-avatar-tag">[@{username}]</span>
            <button className="btn-term-logout" onClick={() => signOut()} title="Sign Out">
              [EXIT]
            </button>
          </div>
        ) : (
          <button className="btn-term-login" onClick={openAuthModal}>
            [&lt;LOGIN&gt;]
          </button>
        )}
      </div>
    </header>
  );
};
