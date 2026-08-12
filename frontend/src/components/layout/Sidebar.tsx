import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const navGroups = [
    {
      title: 'MARKETS',
      items: [
        { path: '/market', label: 'Markets', tag: '[M]' },
        { path: '/market', label: 'Watchlist', tag: '[W]' },
        { path: '/market', label: 'Heatmap', tag: '[H]' },
        { path: '/market', label: 'Screener', tag: '[S]' },
        { path: '/market', label: 'Alerts', tag: '[A]' },
      ],
    },
    {
      title: 'PORTFOLIO',
      items: [
        { path: '/portfolio', label: 'Portfolio', tag: '[P]' },
        { path: '/portfolio', label: 'Holdings', tag: '[H]' },
        { path: '/portfolio', label: 'Performance', tag: '[R]' },
        { path: '/portfolio', label: 'Transactions', tag: '[T]' },
      ],
    },
    {
      title: 'RESEARCH & AI',
      items: [
        { path: '/chat', label: 'AI Assistant', tag: '[AI]', isSparkle: true },
        { path: '/chat', label: 'Research', tag: '[RS]' },
        { path: '/documents', label: 'News', tag: '[NW]' },
        { path: '/documents', label: 'Filings', tag: '[FL]' },
        { path: '/documents', label: 'Transcripts', tag: '[TR]' },
        { path: '/documents', label: 'Documents', tag: '[DC]' },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { path: '/market', label: 'Compare', tag: '[CP]' },
        { path: '/market', label: 'Options Chain', tag: '[OC]' },
        { path: '/market', label: 'Backtest', tag: '[BT]' },
        { path: '/settings', label: 'DCF Calculator', tag: '[DCF]' },
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
          <span className="btn-dash-icon">[::]</span>
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
                  <span className="item-ascii-icon">{item.tag}</span>
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
          <span className="collapse-icon">{sidebarCollapsed ? '[>]' : '[<]'}</span>
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
        {!sidebarCollapsed && (
          <button className="btn-theme-toggle" title="Dark Theme Active">
            <span>[D]</span>
          </button>
        )}
      </div>
    </aside>
  );
};
