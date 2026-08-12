import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MarketMarquee } from './MarketMarquee';
import { Sidebar } from './Sidebar';
import { AuthModal } from '../AuthModal';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed, isAuthModalOpen, closeAuthModal } = useAppStore();

  return (
    <div className={`terminal-app-root ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* 1. Unified Bloomberg Command Header */}
      <Header />

      {/* 2. Real-time Continuous Market Ticker Marquee */}
      <MarketMarquee />

      <div className="terminal-workspace-body">
        {/* Left Terminal Sidebar */}
        <Sidebar />

        {/* Dynamic Full-Width Viewport */}
        <div className="terminal-main-viewport">
          <main className="terminal-page-content">
            <Outlet />
          </main>
          <footer className="terminal-status-footer">
            <div className="footer-status-left">
              <span>FINANCEBTW TERMINAL // REAL-TIME MARKET INTELLIGENCE</span>
              <span className="footer-divider">|</span>
              <span>DATA FEEDS: NSE / BSE / YAHOO / NEWSWIRE</span>
            </div>
            <div className="footer-status-right">
              <span className="live-status-green">[FEED: 100% ONLINE]</span>
              <span>LATENCY: 12ms</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};
