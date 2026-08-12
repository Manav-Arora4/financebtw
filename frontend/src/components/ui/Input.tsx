import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  iconLeft,
  iconRight,
  label,
  hint,
  error,
  fullWidth = false,
  className = '',
  id,
  ...rest
}, ref) => {
  const inputId = id || (label ? `fs-input-${Math.random().toString(36).slice(2, 7)}` : undefined);

  return (
    <div className={['fs-input-wrapper', fullWidth ? 'fs-input-wrapper--full' : '', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className="fs-input-label">{label}</label>
      )}
      <div className={['fs-input-field', error ? 'fs-input-field--error' : ''].filter(Boolean).join(' ')}>
        {iconLeft && <span className="fs-input-icon fs-input-icon--left">{iconLeft}</span>}
        <input
          ref={ref}
          id={inputId}
          className={['fs-input', iconLeft ? 'fs-input--icon-left' : '', iconRight ? 'fs-input--icon-right' : ''].filter(Boolean).join(' ')}
          {...rest}
        />
        {iconRight && <span className="fs-input-icon fs-input-icon--right">{iconRight}</span>}
      </div>
      {error && <span className="fs-input-error">{error}</span>}
      {hint && !error && <span className="fs-input-hint">{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';
