import React from 'react';
import { NavLink } from 'react-router-dom';
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
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const navGroups = [
    {
      title: 'MARKETS',
      items: [
        { path: '/market', label: 'Markets', icon: <IconMarkets size={16} /> },
        { path: '/market', label: 'Watchlist', icon: <IconWatchlist size={16} /> },
        { path: '/market', label: 'Heatmap', icon: <IconHeatmap size={16} /> },
        { path: '/market', label: 'Screener', icon: <IconScreener size={16} /> },
        { path: '/market', label: 'Alerts', icon: <IconAlerts size={16} /> },
      ],
    },
    {
      title: 'PORTFOLIO',
      items: [
        { path: '/portfolio', label: 'Portfolio', icon: <IconPortfolio size={16} /> },
        { path: '/portfolio', label: 'Holdings', icon: <IconHoldings size={16} /> },
        { path: '/portfolio', label: 'Performance', icon: <IconPerformance size={16} /> },
        { path: '/portfolio', label: 'Transactions', icon: <IconTransactions size={16} /> },
      ],
    },
    {
      title: 'RESEARCH',
      items: [
        { path: '/chat', label: 'AI Assistant', icon: <IconSparkles size={16} /> },
        { path: '/chat', label: 'Research', icon: <IconResearch size={16} /> },
        { path: '/documents', label: 'News', icon: <IconNews size={16} /> },
        { path: '/documents', label: 'Filings', icon: <IconFilings size={16} /> },
        { path: '/documents', label: 'Transcripts', icon: <IconTranscripts size={16} /> },
        { path: '/documents', label: 'Documents', icon: <IconDocuments size={16} /> },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { path: '/market', label: 'Compare', icon: <IconCompare size={16} /> },
        { path: '/market', label: 'Options Chain', icon: <IconOptionsChain size={16} /> },
        { path: '/market', label: 'Backtest', icon: <IconBacktest size={16} /> },
        { path: '/settings', label: 'DCF Calculator', icon: <IconDCF size={16} /> },
      ],
    },
  ];

  return (
    <aside className={`finsight-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Top Main Dashboard Pill */}
      <div className="sidebar-top-section">
        <NavLink
          to="/market"
          className={({ isActive }) => `dashboard-main-btn ${isActive ? 'active' : ''}`}
        >
          <IconDashboard size={18} />
          {!sidebarCollapsed && <span className="btn-dash-label">Dashboard</span>}
        </NavLink>
      </div>

      {/* Nav Groups */}
      <nav className="sidebar-scrollable-nav">
        {navGroups.map((grp) => (
          <div key={grp.title} className="sidebar-nav-group">
            {!sidebarCollapsed && <div className="group-heading-text">{grp.title}</div>}
            <div className="group-nav-links">
              {grp.items.map((item, idx) => (
                <NavLink
                  key={`${item.label}-${idx}`}
                  to={item.path}
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="sidebar-item-icon">{item.icon}</span>
                  {!sidebarCollapsed && <span className="item-label-text">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="sidebar-bottom-actions">
        <button className="btn-collapse-sidebar" onClick={toggleSidebar}>
          <IconChevronLeft size={16} className={`collapse-chevron ${sidebarCollapsed ? 'rotated' : ''}`} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
        {!sidebarCollapsed && (
          <button className="btn-theme-toggle" title="Dark Theme Active">
            <IconMoon size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};
