import React from 'react';
import './Badge.css';

export type BadgeVariant = 'default' | 'positive' | 'negative' | 'warning' | 'info' | 'brand' | 'ghost';
export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  className = '',
}) => {
  return (
    <span className={['fs-badge', `fs-badge--${variant}`, `fs-badge--${size}`, className].filter(Boolean).join(' ')}>
      {dot && <span className="fs-badge__dot" />}
      {children}
    </span>
  );
};
