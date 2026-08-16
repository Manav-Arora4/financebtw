import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopTickerBar } from './TopTickerBar';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AIPanel } from './AIPanel';
import { AuthModal } from '../AuthModal';
import { NotificationStack } from '../ui/Notification';
import { CommandPalette } from '../ui/CommandPalette';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import './AppLayout.css';

const NAV_COMMANDS = [
  { id: 'go-dashboard',   label: 'Dashboard',           category: 'Navigation', shortcut: 'G D' },
  { id: 'go-markets',     label: 'Markets',             category: 'Navigation', shortcut: 'G M' },
  { id: 'go-watchlists',  label: 'Watchlists',          category: 'Navigation' },
  { id: 'go-screener',    label: 'Screener',            category: 'Navigation' },
  { id: 'go-portfolio',   label: 'Portfolio',           category: 'Navigation', shortcut: 'G P' },
  { id: 'go-research',    label: 'Research Copilot',    category: 'Navigation' },
  { id: 'go-news',        label: 'News',                category: 'Navigation' },
  { id: 'go-alerts',      label: 'Alerts',              category: 'Navigation' },
  { id: 'go-settings',    label: 'Settings',            category: 'Navigation' },
  { id: 'toggle-ai',      label: 'Toggle Research Copilot Panel', category: 'Actions', shortcut: 'Ctrl+\\' },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar',      category: 'Actions', shortcut: 'Ctrl+B' },
];

const ROUTE_MAP: Record<string, string> = {
  'go-dashboard':  '/dashboard',
  'go-markets':    '/markets',
  'go-watchlists': '/watchlists',
  'go-screener':   '/screener',
  'go-portfolio':  '/portfolio',
  'go-research':   '/research',
  'go-news':       '/news',
  'go-alerts':     '/alerts',
  'go-settings':   '/settings',
};

export const AppLayout: React.FC = () => {
  const {
    isAuthModalOpen, closeAuthModal,
    commandPaletteOpen, setCommandPaletteOpen,
    aiPanelOpen, aiPanelWidth,
    sidebarCollapsed,
    toggleAIPanel, toggleSidebar,
    setActiveNavTab,
  } = useAppStore();

  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Sync active nav tab with current route
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'dashboard';
    setActiveNavTab(path);
  }, [location.pathname, setActiveNavTab]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K → Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Ctrl+B → Toggle Sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl+\ → Toggle AI Panel
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        toggleAIPanel();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen, toggleSidebar, toggleAIPanel]);

  const handleCommandSelect = (id: string) => {
    if (ROUTE_MAP[id]) {
      navigate(ROUTE_MAP[id]);
    } else if (id === 'toggle-ai') {
      toggleAIPanel();
    } else if (id === 'toggle-sidebar') {
      toggleSidebar();
    }
  };

  const commandItems = NAV_COMMANDS.map((cmd) => ({
    ...cmd,
    onSelect: () => handleCommandSelect(cmd.id),
  }));

  const sidebarWidth = sidebarCollapsed ? 48 : 200;
  const panelWidth   = aiPanelOpen ? aiPanelWidth : 0;

  return (
    <div className="fs-app-root">
      {/* Row 1: Live market ticker ribbon */}
      <TopTickerBar />

      {/* Row 2: Global header */}
      <Header />

      {/* Row 3: Main workspace */}
      <div className="fs-workspace">
        {/* Left nav sidebar */}
        <Sidebar />

        {/* Resizable divider between sidebar and main */}
        <div className="fs-workspace-divider" />

        {/* Center page viewport */}
        <main
          ref={mainRef}
          className="fs-main"
          style={{ '--sidebar-w': `${sidebarWidth}px`, '--panel-w': `${panelWidth}px` } as React.CSSProperties}
        >
          <div className="fs-page">
            <Outlet />
          </div>
        </main>

        {/* Resizable divider before AI panel */}
        {aiPanelOpen && <div className="fs-workspace-divider" />}

        {/* Right docked AI / Research Copilot panel */}
        <AIPanel />
      </div>

      {/* Global overlays */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        items={commandItems}
        placeholder="Search stocks, pages, actions... (Ctrl+K)"
      />
      <NotificationStack />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};
