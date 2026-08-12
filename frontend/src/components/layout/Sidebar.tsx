import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface NavItem {
  path: string;
  label: string;
  code: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, selectedSymbol } = useAppStore();

  const navSections: NavSection[] = [
    {
      title: 'RESEARCH & TERMINAL',
      items: [
        { path: '/market', label: 'Market Intelligence', code: 'GP', badge: 'LIVE' },
        { path: '/chat', label: 'AI Financial Chat', code: 'AI', badge: 'LANG' },
      ],
    },
    {
      title: 'DATA & PORTFOLIO',
      items: [
        { path: '/documents', label: 'Filings & Knowledge Base', code: 'RAG', badge: 'QDRANT' },
        { path: '/portfolio', label: 'Portfolio & Risk Engine', code: 'PORT', badge: 'VaR' },
      ],
    },
    {
      title: 'SYSTEM & BLUEPRINT',
      items: [
        { path: '/overview', label: 'Architecture & 20-Phases', code: 'DES' },
        { path: '/settings', label: 'Config & Model Gateway', code: 'CFG' },
      ],
    },
  ];

  return (
    <aside className={`terminal-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="term-sidebar-header">
        <div className="term-brand">
          <span className="brand-bloomberg-tag">FB&gt;</span>
          {!sidebarCollapsed && <span className="term-brand-name">TERMINAL</span>}
        </div>
        <button
          className="btn-term-collapse"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? '[&gt;]' : '[&lt;]'}
        </button>
      </div>

      {/* Active Security Context */}
      {!sidebarCollapsed && (
        <div className="sidebar-sec-context">
          <span className="sec-lbl">TARGET SECURITY:</span>
          <span className="sec-val">{selectedSymbol} &lt;EQ&gt;</span>
        </div>
      )}

      {/* Navigation Groups */}
      <nav className="term-sidebar-nav">
        {navSections.map((sec) => (
          <div key={sec.title} className="term-nav-group">
            {!sidebarCollapsed && <div className="term-nav-group-title">{sec.title}</div>}
            <div className="term-nav-items">
              {sec.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `term-nav-link ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? `${item.code}: ${item.label}` : undefined}
                >
                  <span className="term-fn-tag">&lt;{item.code}&gt;</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="term-nav-text">{item.label}</span>
                      {item.badge && <span className="term-nav-badge">[{item.badge}]</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="term-sidebar-footer">
        {!sidebarCollapsed ? (
          <div className="term-footer-meta">
            <div className="term-status-line">
              <span className="term-dot-green"></span>
              <span className="term-status-txt">API: 100% ONLINE</span>
            </div>
            <div className="term-env-txt">ENV: PRODUCTION SIM</div>
          </div>
        ) : (
          <div className="term-dot-green" title="System Online"></div>
        )}
      </div>
    </aside>
  );
};
