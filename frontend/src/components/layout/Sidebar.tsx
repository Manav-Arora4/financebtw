import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface NavItem {
  path: string;
  label: string;
  code: string;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, selectedSymbol } = useAppStore();

  const navItems: NavItem[] = [
    { path: '/market', label: 'Market Overview', code: 'MKT', badge: 'LIVE' },
    { path: '/chat', label: 'Financial AI Chat', code: 'AI' },
    { path: '/documents', label: 'Filings & Reports', code: 'DOC' },
    { path: '/portfolio', label: 'Portfolio & Risk', code: 'PTF' },
    { path: '/settings', label: 'Settings & Feeds', code: 'SET' },
  ];

  return (
    <aside className={`terminal-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-top-row">
        {!sidebarCollapsed && <span className="sidebar-title">NAVIGATION</span>}
        <button
          className="btn-sidebar-toggle"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? '[>]' : '[<]'}
        </button>
      </div>

      {/* Active Security Target */}
      {!sidebarCollapsed && (
        <div className="sidebar-active-target">
          <span className="target-lbl">ACTIVE SECURITY:</span>
          <span className="target-code">{selectedSymbol}</span>
        </div>
      )}

      {/* Nav List */}
      <nav className="sidebar-nav-list">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            title={sidebarCollapsed ? `${item.code}: ${item.label}` : undefined}
          >
            <span className="nav-code">&lt;{item.code}&gt;</span>
            {!sidebarCollapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-pill">[{item.badge}]</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-bottom-status">
        {!sidebarCollapsed ? (
          <div className="status-container">
            <div className="status-live-line">
              <span className="pulse-green"></span>
              <span className="status-txt">FEED: 100% ONLINE</span>
            </div>
            <div className="market-session-txt">SESSION: REGULAR TRADING</div>
          </div>
        ) : (
          <div className="pulse-green" title="Feeds Online"></div>
        )}
      </div>
    </aside>
  );
};
