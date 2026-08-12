import React from 'react';
import { Outlet } from 'react-router-dom';
import { TerminalFunctionBar } from './TerminalFunctionBar';
import { Header } from './Header';
import { MarketMarquee } from './MarketMarquee';
import { Sidebar } from './Sidebar';
import { AuthModal } from '../AuthModal';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed, isAuthModalOpen, closeAuthModal } = useAppStore();

  return (
    <div className={`terminal-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* 1. Bloomberg Function Key Strip & Global Clocks */}
      <TerminalFunctionBar />

      {/* 2. Top Amber Command Line & Market Selectors */}
      <Header />

      {/* 3. Real-time Continuous Market Ticker Marquee */}
      <MarketMarquee />

      <div className="terminal-body">
        {/* Left Terminal Sidebar */}
        <Sidebar />

        {/* Dynamic Multi-Panel Terminal Content Pane */}
        <div className="terminal-viewport">
          <main className="terminal-content">
            <Outlet />
          </main>
          <footer className="terminal-footer">
            <div className="footer-left">
              <span>FINANCEBTW v0.1.0 // BLOOMBERG PROFESSIONAL SIMULATION</span>
              <span className="divider-sep">|</span>
              <span>ORCHESTRATION: LANGGRAPH v0.2</span>
              <span className="divider-sep">|</span>
              <span>RAG: LLAMAINDEX HYBRID</span>
            </div>
            <div className="footer-right">
              <span className="status-badge-green">[ALL SYSTEMS NOMINAL]</span>
              <span>LATENCY: 14ms</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};
