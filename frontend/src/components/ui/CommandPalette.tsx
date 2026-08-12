import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './CommandPalette.css';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  category?: string;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Search stocks, pages, actions...',
}) => {
  const [query, setQuery] = React.useState('');
  const [highlighted, setHighlighted] = React.useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  // Group by category
  const grouped: Record<string, CommandItem[]> = {};
  for (const item of filtered) {
    const cat = item.category ?? 'Actions';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  useEffect(() => setHighlighted(0), [query]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlighted]) { filtered[highlighted].onSelect(); onClose(); }
    }
  }, [isOpen, filtered, highlighted, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  let flatIdx = 0;

  return createPortal(
    <div className="fs-cmd-backdrop" onClick={onClose}>
      <div className="fs-cmd" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="fs-cmd__search">
          <svg className="fs-cmd__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="fs-cmd__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <kbd className="fs-cmd__esc">ESC</kbd>
        </div>

        {/* Results */}
        <div className="fs-cmd__results">
          {Object.entries(grouped).length === 0 ? (
            <div className="fs-cmd__empty">No results for "{query}"</div>
          ) : (
            Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat} className="fs-cmd__group">
                <div className="fs-cmd__group-label">{cat}</div>
                {catItems.map((item) => {
                  const idx = flatIdx++;
                  return (
                    <button
                      key={item.id}
                      className={['fs-cmd__item', idx === highlighted ? 'fs-cmd__item--highlighted' : ''].filter(Boolean).join(' ')}
                      onMouseEnter={() => setHighlighted(idx)}
                      onClick={() => { item.onSelect(); onClose(); }}
                    >
                      {item.icon && <span className="fs-cmd__item-icon">{item.icon}</span>}
                      <span className="fs-cmd__item-text">
                        <span className="fs-cmd__item-label">{item.label}</span>
                        {item.description && <span className="fs-cmd__item-desc">{item.description}</span>}
                      </span>
                      {item.shortcut && <kbd className="fs-cmd__item-shortcut">{item.shortcut}</kbd>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="fs-cmd__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>ESC</kbd> close</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
