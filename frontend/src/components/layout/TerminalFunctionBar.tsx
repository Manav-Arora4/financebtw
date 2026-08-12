import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const TerminalFunctionBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMarket, selectedSymbol } = useAppStore();

  const [timeUtc, setTimeUtc] = useState('');
  const [timeIst, setTimeIst] = useState('');
  const [timeEst, setTimeEst] = useState('');
  const [timeGmt, setTimeGmt] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      setTimeIst(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
      setTimeEst(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' EST'
      );
      setTimeGmt(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Europe/London',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' LON'
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const functionKeys = [
    { key: 'F1', code: 'HELP', label: 'Help / Specs', path: '/overview' },
    { key: 'F2', code: 'DES', label: 'System Overview', path: '/overview' },
    { key: 'F3', code: 'GP', label: 'Market Term', path: '/market' },
    { key: 'F4', code: 'AI', label: 'AI LangGraph', path: '/chat' },
    { key: 'F5', code: 'RAG', label: 'Filings / KB', path: '/documents' },
    { key: 'F6', code: 'PORT', label: 'Portfolio / Risk', path: '/portfolio' },
    { key: 'F7', code: 'CFG', label: 'Config / Models', path: '/settings' },
  ];

  return (
    <div className="terminal-fn-bar">
      {/* Function Key Buttons */}
      <div className="fn-keys-group">
        <span className="terminal-brand-pill">FB&gt; TERMINAL</span>
        {functionKeys.map((fn) => {
          const isActive = location.pathname === fn.path;
          return (
            <button
              key={fn.code}
              className={`fn-key-btn ${isActive ? 'active' : ''}`}
              onClick={() => navigate(fn.path)}
              title={`${fn.key}: ${fn.label}`}
            >
              <span className="fn-tag">&lt;{fn.key} {fn.code}&gt;</span>
            </button>
          );
        })}
      </div>

      {/* Global Clocks & Market Telemetry */}
      <div className="terminal-clocks-group">
        <div className="clock-item">
          <span className="clock-city">UTC:</span>
          <span className="clock-time">{timeUtc}</span>
        </div>
        <div className="clock-item highlight">
          <span className="clock-city">BOM:</span>
          <span className="clock-time">{timeIst}</span>
        </div>
        <div className="clock-item">
          <span className="clock-city">NYC:</span>
          <span className="clock-time">{timeEst}</span>
        </div>
        <div className="clock-item">
          <span className="clock-city">LON:</span>
          <span className="clock-time">{timeGmt}</span>
        </div>
        <div className="terminal-market-status">
          <span className="status-indicator live"></span>
          <span className="status-lbl">
            {selectedMarket.toUpperCase()} : {selectedSymbol} [LIVE]
          </span>
        </div>
      </div>
    </div>
  );
};
