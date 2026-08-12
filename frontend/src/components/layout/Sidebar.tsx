import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface NavItem {
  path: string;
  label: string;
  asciiTag: string;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, selectedMarket } = useAppStore();

  const navSections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'RESEARCH',
      items: [
        { path: '/chat', label: 'AI Agent Chat', asciiTag: '[AI]' },
        { path: '/market', label: 'Market Intelligence', asciiTag: '[MKT]' },
      ],
    },
    {
      title: 'KNOWLEDGE & ASSETS',
      items: [
        { path: '/documents', label: 'Financial Filings', asciiTag: '[DOC]', badge: 'RAG' },
        { path: '/portfolio', label: 'Portfolio Engine', asciiTag: '[PTF]', badge: 'PRO' },
      ],
    },
    {
      title: 'SYSTEM & ROADMAP',
      items: [
        { path: '/overview', label: 'Architecture & Phases', asciiTag: '[SYS]' },
        { path: '/settings', label: 'Settings & Models', asciiTag: '[CFG]' },
      ],
    },
  ];

  return (
    <aside className={`app-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">[FB]</span>
          {!sidebarCollapsed && <span className="brand-name">FinanceBtw</span>}
        </div>
        <button
          className="btn-collapse"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? '[>]' : '[<]'}
        </button>
      </div>

      {/* Workspace Indicator */}
      {!sidebarCollapsed && (
        <div className="workspace-badge">
          <span className="workspace-label">ACTIVE MARKET:</span>
          <span className="workspace-val">
            {selectedMarket === 'india' && '[INDIA / NSE]'}
            {selectedMarket === 'usa' && '[USA / SEC]'}
            {selectedMarket === 'crypto' && '[CRYPTO / 24H]'}
          </span>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {navSections.map((sec) => (
          <div key={sec.title} className="nav-group">
            {!sidebarCollapsed && <div className="nav-group-title">{sec.title}</div>}
            <div className="nav-group-items">
              {sec.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-ascii-tag">{item.asciiTag}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="nav-text">{item.label}</span>
                      {item.badge && <span className="nav-badge">[{item.badge}]</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!sidebarCollapsed ? (
          <div className="sidebar-footer-content">
            <div className="status-row">
              <span className="status-dot online"></span>
              <span className="status-text">[API: 100% ONLINE]</span>
            </div>
            <div className="branch-text">branch: feature/frontend-layout</div>
          </div>
        ) : (
          <div className="status-dot online" title="System Online"></div>
        )}
      </div>
    </aside>
  );
};
