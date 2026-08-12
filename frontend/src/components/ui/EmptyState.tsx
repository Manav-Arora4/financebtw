import React from 'react';
import './EmptyState.css';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  size = 'md',
}) => (
  <div className={['fs-empty', `fs-empty--${size}`, className].filter(Boolean).join(' ')}>
    {icon && <div className="fs-empty__icon">{icon}</div>}
    <div className="fs-empty__text">
      <p className="fs-empty__title">{title}</p>
      {description && <p className="fs-empty__desc">{description}</p>}
    </div>
    {action && <div className="fs-empty__action">{action}</div>}
  </div>
);
