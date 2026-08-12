import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { selectedMarket, setSelectedMarket, selectedSymbol, setSelectedSymbol, openAuthModal } = useAppStore();
  const [commandInput, setCommandInput] = useState('');
  const [timeIst, setTimeIst] = useState('');
  const [timeEst, setTimeEst] = useState('');
  const [timeGmt, setTimeGmt] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeIst(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }) + ' IST'
      );
      setTimeEst(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }) + ' EST'
      );
      setTimeGmt(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Europe/London',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }) + ' LON'
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toUpperCase();
    if (!cmd) return;

    if (cmd === 'MKT' || cmd === 'MARKET' || cmd === 'QUOTE') {
      navigate('/market');
    } else if (cmd === 'AI' || cmd === 'CHAT' || cmd === 'ASK') {
      navigate('/chat');
    } else if (cmd === 'DOCS' || cmd === 'FILINGS' || cmd === 'RAG') {
      navigate('/documents');
    } else if (cmd === 'PORT' || cmd === 'PORTFOLIO' || cmd === 'RISK') {
      navigate('/portfolio');
    } else if (cmd === 'CFG' || cmd === 'SETTINGS') {
      navigate('/settings');
    } else {
      const ticker = cmd.includes('.') ? cmd : `${cmd}.NS`;
      setSelectedSymbol(ticker);
      navigate('/market');
    }
    setCommandInput('');
  };

  const username =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.username as string) ||
    (user?.email ? user.email.split('@')[0] : 'Guest');

  return (
    <header className="terminal-header-main">
      {/* Brand & Market Status */}
      <div className="header-brand-group">
        <div className="header-logo" onClick={() => navigate('/market')}>
          <span className="logo-tag">[FB]</span>
          <span className="logo-title">FinanceBtw</span>
        </div>
        <div className="active-ticker-tag">
          <span className="dot-live"></span>
          <span className="ticker-code">{selectedSymbol}</span>
        </div>
      </div>

      {/* Command Search Bar */}
      <form className="header-command-form" onSubmit={handleCommandSubmit}>
        <span className="cmd-prompt">FB&gt;</span>
        <input
          type="text"
          className="cmd-input"
          placeholder="Enter stock ticker (e.g. RELIANCE, TCS, INFY) or function (AI, PORT, DOCS) <GO>"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
        />
        <button type="submit" className="btn-cmd-go">
          &lt;GO&gt;
        </button>
      </form>

      {/* Market Switcher */}
      <div className="header-market-pills">
        <button
          className={`market-pill ${selectedMarket === 'india' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('india')}
          title="Indian Markets (NSE / BSE)"
        >
          [INDIA / NSE]
        </button>
        <button
          className={`market-pill ${selectedMarket === 'usa' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('usa')}
          title="US Markets (NYSE / NASDAQ)"
        >
          [USA / SEC]
        </button>
        <button
          className={`market-pill ${selectedMarket === 'crypto' ? 'active' : ''}`}
          onClick={() => setSelectedMarket('crypto')}
          title="Crypto Universe"
        >
          [CRYPTO]
        </button>
      </div>

      {/* Global Clocks */}
      <div className="header-clocks">
        <span className="clock-val highlight">{timeIst}</span>
        <span className="clock-val">{timeEst}</span>
        <span className="clock-val">{timeGmt}</span>
      </div>

      {/* User Session Profile */}
      <div className="header-user-group">
        {user ? (
          <div className="user-pill">
            <span className="user-icon">[@]</span>
            <span className="user-name">{username}</span>
            <button className="btn-exit" onClick={() => signOut()} title="Sign Out">
              [EXIT]
            </button>
          </div>
        ) : (
          <button className="btn-login-terminal" onClick={openAuthModal}>
            [+] Sign In
          </button>
        )}
      </div>
    </header>
  );
};
