import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopTickerBar } from './TopTickerBar';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';
import { AuthModal } from '../AuthModal';
import { useAppStore } from '../../store/useAppStore';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed, isAuthModalOpen, closeAuthModal } = useAppStore();

  return (
    <div className={`finsight-app-root ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Top 1: Live Market Indices Ticker Ribbon */}
      <TopTickerBar />

      {/* Top 2: Global Header with Search & Profile */}
      <Header />

      {/* Main Body Workspace */}
      <div className="finsight-workspace-body">
        {/* Left Nav Sidebar */}
        <Sidebar />

        {/* Dynamic Center Page Viewport */}
        <main className="finsight-main-viewport">
          <Outlet />
        </main>

        {/* Right Docked AI Assistant Panel */}
        <AIAssistantDrawer />
      </div>

      {/* Global Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};
