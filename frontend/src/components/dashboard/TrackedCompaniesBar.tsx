import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { IconSearch } from '../icons/Icons';
import './TrackedCompaniesBar.css';

export const TrackedCompaniesBar: React.FC = () => {
  const { selectedSymbol, setSelectedSymbol, trackedSymbols, removeTrackedSymbol, addTrackedSymbol } = useAppStore();
  const [showAddInput, setShowAddInput] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim()) return;
    let sym = newSymbol.trim().toUpperCase();
    if (!sym.includes('.')) {
      sym = `${sym}.NS`;
    }
    addTrackedSymbol(sym);
    setNewSymbol('');
    setShowAddInput(false);
  };

  return (
    <div className="tracked-companies-bar">
      <div className="tracked-tabs-group">
        <span className="tracked-label">Tracked Securities:</span>
        {trackedSymbols.map((sym) => {
          const isActive = selectedSymbol === sym;
          const clean = sym.replace('.NS', '').replace('.BO', '');
          return (
            <div key={sym} className={`tracked-pill-wrapper ${isActive ? 'active' : ''}`}>
              <button
                className="tracked-pill-btn"
                onClick={() => setSelectedSymbol(sym)}
                title={`Switch to ${clean}`}
              >
                <span className="tracked-pill-sym">{clean}</span>
                {isActive && <span className="active-dot" />}
              </button>
              <button
                className="tracked-pill-close"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTrackedSymbol(sym);
                }}
                title={`Remove ${clean}`}
              >
                ×
              </button>
            </div>
          );
        })}

        {showAddInput ? (
          <form className="tracked-add-form" onSubmit={handleAddSubmit}>
            <input
              type="text"
              placeholder="e.g. INFY, TCS..."
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="tracked-add-input"
              autoFocus
            />
            <button type="submit" className="tracked-add-confirm">Add</button>
            <button
              type="button"
              className="tracked-add-cancel"
              onClick={() => setShowAddInput(false)}
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            className="btn-add-tracked"
            onClick={() => setShowAddInput(true)}
          >
            + Add Security
          </button>
        )}
      </div>

      <div className="tracked-actions-right">
        <button
          className="btn-deselect-workspace"
          onClick={() => setSelectedSymbol(null)}
          title="Back to Security Selector"
        >
          <IconSearch size={13} />
          <span>Change / Browse Securities</span>
        </button>
      </div>
    </div>
  );
};
