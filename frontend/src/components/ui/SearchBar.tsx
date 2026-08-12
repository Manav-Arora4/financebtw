import React, { forwardRef } from 'react';
import './SearchBar.css';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  size?: 'sm' | 'md' | 'lg';
  shortcut?: string;
  fullWidth?: boolean;
}

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ClearIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  onClear,
  size = 'md',
  shortcut,
  fullWidth = false,
  value,
  className = '',
  ...rest
}, ref) => {
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    <div className={['fs-search', `fs-search--${size}`, fullWidth ? 'fs-search--full' : '', className].filter(Boolean).join(' ')}>
      <span className="fs-search__icon"><SearchIcon /></span>
      <input
        ref={ref}
        className="fs-search__input"
        value={value}
        type="search"
        autoComplete="off"
        spellCheck={false}
        {...rest}
      />
      {hasValue && onClear ? (
        <button className="fs-search__clear" onClick={onClear} type="button" aria-label="Clear search">
          <ClearIcon />
        </button>
      ) : shortcut && !hasValue ? (
        <kbd className="fs-search__shortcut">{shortcut}</kbd>
      ) : null}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
