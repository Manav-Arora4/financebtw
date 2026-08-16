import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Tooltip } from '../ui/Tooltip';
import './Sidebar.css';

/* ── SVG Icons (inline for zero dependency) ─────────────── */
const IC = {
  Dashboard: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Markets: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Watchlist: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Screener: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Portfolio: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
    </svg>
  ),
  Research: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  Documents: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  News: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>
    </svg>
  ),
  Alerts: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Settings: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  MenuOpen: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  ResearchHub: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
};

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { path: '/dashboard',  label: 'Dashboard',  icon: <IC.Dashboard /> },
    ],
  },
  {
    title: 'Markets',
    items: [
      { path: '/markets',    label: 'Markets',    icon: <IC.Markets /> },
      { path: '/watchlists', label: 'Watchlists', icon: <IC.Watchlist /> },
      { path: '/screener',   label: 'Screener',   icon: <IC.Screener /> },
      { path: '/alerts',     label: 'Alerts',     icon: <IC.Alerts />, badge: 3 },
    ],
  },
  {
    title: 'Portfolio',
    items: [
      { path: '/portfolio',  label: 'Portfolio',  icon: <IC.Portfolio /> },
    ],
  },
  {
    title: 'Research',
    items: [
      { path: '/research',      label: 'Research Copilot', icon: <IC.Research /> },
      { path: '/research-hub',  label: 'Research Hub',     icon: <IC.ResearchHub /> },
      { path: '/news',          label: 'News',             icon: <IC.News /> },
      { path: '/documents',     label: 'Documents',        icon: <IC.Documents /> },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <aside className={`fs-sidebar ${sidebarCollapsed ? 'fs-sidebar--collapsed' : ''}`}>
      {/* Nav groups */}
      <nav className="fs-sidebar__nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="fs-sidebar__group">
            {!sidebarCollapsed && (
              <span className="fs-sidebar__group-label">{group.title}</span>
            )}
            {group.items.map((item) => {
              const active = isActive(item.path);
              const btn = (
                <button
                  key={item.path}
                  className={`fs-sidebar__item ${active ? 'fs-sidebar__item--active' : ''}`}
                  onClick={() => handleNav(item.path)}
                  title={sidebarCollapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="fs-sidebar__item-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <span className="fs-sidebar__item-label">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span className="fs-sidebar__badge">{item.badge}</span>
                  )}
                </button>
              );
              return sidebarCollapsed ? (
                <Tooltip key={item.path} content={item.label} placement="right" delay={200}>
                  {btn}
                </Tooltip>
              ) : btn;
            })}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="fs-sidebar__footer">
        {/* Settings */}
        {(() => {
          const active = isActive('/settings');
          const settingsBtn = (
            <button
              className={`fs-sidebar__item ${active ? 'fs-sidebar__item--active' : ''}`}
              onClick={() => handleNav('/settings')}
              title={sidebarCollapsed ? 'Settings' : undefined}
              aria-current={active ? 'page' : undefined}
            >
              <span className="fs-sidebar__item-icon"><IC.Settings /></span>
              {!sidebarCollapsed && <span className="fs-sidebar__item-label">Settings</span>}
            </button>
          );
          return sidebarCollapsed ? (
            <Tooltip content="Settings" placement="right" delay={200}>{settingsBtn}</Tooltip>
          ) : settingsBtn;
        })()}

        <div className="fs-sidebar__divider" />

        {/* Collapse toggle */}
        <button
          className="fs-sidebar__collapse-btn"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className={`fs-sidebar__collapse-icon ${sidebarCollapsed ? 'fs-sidebar__collapse-icon--rotated' : ''}`}>
            <IC.ChevronLeft />
          </span>
          {!sidebarCollapsed && <span className="fs-sidebar__item-label">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
