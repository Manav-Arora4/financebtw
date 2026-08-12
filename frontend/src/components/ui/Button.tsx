import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'brand';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  fullWidth = false,
  active = false,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  return (
    <button
      className={[
        'fs-btn',
        `fs-btn--${variant}`,
        `fs-btn--${size}`,
        fullWidth ? 'fs-btn--full' : '',
        active ? 'fs-btn--active' : '',
        loading ? 'fs-btn--loading' : '',
        className,
      ].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="fs-btn__spinner" aria-hidden="true" />
      )}
      {!loading && iconLeft && (
        <span className="fs-btn__icon fs-btn__icon--left">{iconLeft}</span>
      )}
      {children && <span className="fs-btn__label">{children}</span>}
      {!loading && iconRight && (
        <span className="fs-btn__icon fs-btn__icon--right">{iconRight}</span>
      )}
    </button>
  );
};
