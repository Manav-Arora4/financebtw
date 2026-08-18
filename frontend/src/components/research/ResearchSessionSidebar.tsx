import React, { useState } from 'react';
import type { ResearchSession } from './types';
import { IconSearch } from '../icons/Icons';
import './ResearchSessionSidebar.css';

interface Props {
  sessions: ResearchSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const ResearchSessionSidebar: React.FC<Props> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onTogglePin,
}) => {
  const [search, setSearch] = useState('');

  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase().trim();
    return !q || s.title.toLowerCase().includes(q) || (s.symbol && s.symbol.toLowerCase().includes(q));
  });

  const pinned = filtered.filter((s) => s.isPinned);
  const unpinned = filtered.filter((s) => !s.isPinned);

  return (
    <aside className="research-session-sidebar">
      {/* Top Action */}
      <div className="sidebar-top-action-bar">
        <button
          type="button"
          className="btn-new-research-session"
          onClick={onNewSession}
        >
          <span>+ New Research Analysis</span>
          <span className="btn-kbd-shortcut">Ctrl+N</span>
        </button>
      </div>

      {/* Filter / Search */}
      <div className="sidebar-search-container">
        <IconSearch size={14} />
        <input
          type="text"
          placeholder="Filter research threads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sidebar-search-input"
        />
        {search && (
          <button
            type="button"
            className="sidebar-search-clear"
            onClick={() => setSearch('')}
          >
            ✕
          </button>
        )}
      </div>

      {/* Session Lists */}
      <div className="sidebar-sessions-scroll">
        {/* Pinned Section */}
        {pinned.length > 0 && (
          <div className="session-group-block">
            <span className="session-group-heading">📌 Pinned Analyses</span>
            <div className="session-items-stack">
              {pinned.map((session) => (
                <div
                  key={session.id}
                  className={`session-nav-item ${session.id === activeSessionId ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="session-item-main">
                    <div className="session-item-title-line">
                      {session.symbol && (
                        <span className="session-ticker-badge">{session.symbol}</span>
                      )}
                      <span className="session-title-text">{session.title}</span>
                    </div>
                    <span className="session-time-ago">{session.updatedAt}</span>
                  </div>

                  <div className="session-item-actions">
                    <button
                      type="button"
                      className="session-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(session.id);
                      }}
                      title="Unpin"
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      className="session-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      title="Delete thread"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Sessions */}
        <div className="session-group-block">
          <span className="session-group-heading">Recent Analyses</span>
          {unpinned.length === 0 ? (
            <div className="sidebar-empty-state">
              <span>No research threads found</span>
            </div>
          ) : (
            <div className="session-items-stack">
              {unpinned.map((session) => (
                <div
                  key={session.id}
                  className={`session-nav-item ${session.id === activeSessionId ? 'active' : ''}`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="session-item-main">
                    <div className="session-item-title-line">
                      {session.symbol && (
                        <span className="session-ticker-badge">{session.symbol}</span>
                      )}
                      <span className="session-title-text">{session.title}</span>
                    </div>
                    <span className="session-time-ago">{session.updatedAt}</span>
                  </div>

                  <div className="session-item-actions">
                    <button
                      type="button"
                      className="session-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(session.id);
                      }}
                      title="Pin thread"
                    >
                      ☆
                    </button>
                    <button
                      type="button"
                      className="session-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      title="Delete thread"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
