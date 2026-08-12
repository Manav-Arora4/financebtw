import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MarketMarquee } from './MarketMarquee';
import { AuthModal } from '../AuthModal';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed, isAuthModalOpen, closeAuthModal } = useAppStore();

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Top Continuous Marquee */}
      <MarketMarquee />

      <div className="shell-body">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Pane */}
        <div className="shell-main">
          <Header />
          <main className="page-content">
            <Outlet />
          </main>
          <footer className="shell-footer">
            <span>FinanceBtw v0.1.0 -- Production-grade AI financial research assistant</span>
            <span>LangGraph | LlamaIndex | LiteLLM | Qdrant | Supabase</span>
          </footer>
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};
