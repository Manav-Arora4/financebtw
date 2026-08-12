import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  IconDashboard,
  IconMarkets,
  IconWatchlist,
  IconHeatmap,
  IconScreener,
  IconAlerts,
  IconPortfolio,
  IconHoldings,
  IconPerformance,
  IconTransactions,
  IconSparkles,
  IconResearch,
  IconNews,
  IconFilings,
  IconTranscripts,
  IconDocuments,
  IconCompare,
  IconOptionsChain,
  IconBacktest,
  IconDCF,
  IconChevronLeft,
  IconMoon,
} from '../icons/Icons';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, activeNavTab, setActiveNavTab } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (label: string, path: string) => {
    setActiveNavTab(label);
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const navGroups = [
    {
      title: 'MARKETS',
      items: [
        { path: '/market', label: 'Markets', icon: <IconMarkets size={15} /> },
        { path: '/market', label: 'Watchlist', icon: <IconWatchlist size={15} /> },
        { path: '/market', label: 'Heatmap', icon: <IconHeatmap size={15} /> },
        { path: '/market', label: 'Screener', icon: <IconScreener size={15} /> },
        { path: '/market', label: 'Alerts', icon: <IconAlerts size={15} /> },
      ],
    },
    {
      title: 'PORTFOLIO',
      items: [
        { path: '/portfolio', label: 'Portfolio', icon: <IconPortfolio size={15} /> },
        { path: '/portfolio', label: 'Holdings', icon: <IconHoldings size={15} /> },
        { path: '/portfolio', label: 'Performance', icon: <IconPerformance size={15} /> },
        { path: '/portfolio', label: 'Transactions', icon: <IconTransactions size={15} /> },
      ],
    },
    {
      title: 'RESEARCH',
      items: [
        { path: '/chat', label: 'AI Assistant', icon: <IconSparkles size={15} /> },
        { path: '/chat', label: 'Research', icon: <IconResearch size={15} /> },
        { path: '/documents', label: 'News', icon: <IconNews size={15} /> },
        { path: '/documents', label: 'Filings', icon: <IconFilings size={15} /> },
        { path: '/documents', label: 'Transcripts', icon: <IconTranscripts size={15} /> },
        { path: '/documents', label: 'Documents', icon: <IconDocuments size={15} /> },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { path: '/market', label: 'Compare', icon: <IconCompare size={15} /> },
        { path: '/market', label: 'Options Chain', icon: <IconOptionsChain size={15} /> },
        { path: '/market', label: 'Backtest', icon: <IconBacktest size={15} /> },
        { path: '/settings', label: 'DCF Calculator', icon: <IconDCF size={15} /> },
      ],
    },
  ];

  return (
    <aside className={`finsight-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Top Main Dashboard Pill */}
      <div className="sidebar-top-section">
        <button
          className={`dashboard-main-btn ${activeNavTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('Dashboard', '/market')}
        >
          <IconDashboard size={16} />
          {!sidebarCollapsed && <span className="btn-dash-label">Dashboard</span>}
        </button>
      </div>

      {/* Nav Groups */}
      <nav className="sidebar-scrollable-nav">
        {navGroups.map((grp) => (
          <div key={grp.title} className="sidebar-nav-group">
            {!sidebarCollapsed && <div className="group-heading-text">{grp.title}</div>}
            <div className="group-nav-links">
              {grp.items.map((item) => {
                const isItemActive = activeNavTab === item.label;
                return (
                  <button
                    key={item.label}
                    className={`sidebar-nav-item ${isItemActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.label, item.path)}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="sidebar-item-icon">{item.icon}</span>
                    {!sidebarCollapsed && <span className="item-label-text">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="sidebar-bottom-actions">
        <button className="btn-collapse-sidebar" onClick={toggleSidebar}>
          <IconChevronLeft size={15} className={`collapse-chevron ${sidebarCollapsed ? 'rotated' : ''}`} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
        {!sidebarCollapsed && (
          <button className="btn-theme-toggle" title="Dark Theme Active">
            <IconMoon size={15} />
          </button>
        )}
      </div>
    </aside>
  );
};
