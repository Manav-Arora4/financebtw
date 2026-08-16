import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string, option: DropdownOption) => void;
  placeholder?: string;
  disabled?: boolean;
  width?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  width,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (opt: DropdownOption) => {
    if (opt.disabled || opt.divider) return;
    onChange?.(opt.value, opt);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={['fs-dropdown', open ? 'fs-dropdown--open' : '', disabled ? 'fs-dropdown--disabled' : '', className].filter(Boolean).join(' ')}
      style={{ width }}
    >
      <button
        className="fs-dropdown__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        type="button"
      >
        {selected?.icon && <span className="fs-dropdown__icon">{selected.icon}</span>}
        <span className="fs-dropdown__value">
          {selected ? selected.label : <span className="fs-dropdown__placeholder">{placeholder}</span>}
        </span>
        <svg className={['fs-dropdown__chevron', open ? 'fs-dropdown__chevron--open' : ''].filter(Boolean).join(' ')}
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="fs-dropdown__menu">
          {options.map((opt, i) =>
            opt.divider ? (
              <div key={i} className="fs-dropdown__divider" />
            ) : (
              <button
                key={opt.value}
                className={['fs-dropdown__option', opt.value === value ? 'fs-dropdown__option--selected' : '', opt.disabled ? 'fs-dropdown__option--disabled' : ''].filter(Boolean).join(' ')}
                onClick={() => handleSelect(opt)}
                disabled={opt.disabled}
                type="button"
              >
                {opt.icon && <span className="fs-dropdown__option-icon">{opt.icon}</span>}
                <span>{opt.label}</span>
                {opt.value === value && (
                  <svg className="fs-dropdown__check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
