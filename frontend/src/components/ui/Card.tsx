import React from 'react';
import './Card.css';

export interface CardProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  bordered?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerRight,
  children,
  footer,
  className = '',
  bodyClassName = '',
  noPadding = false,
  bordered = false,
  style,
}) => {
  const hasHeader = title || subtitle || headerRight;

  return (
    <div
      className={['fs-card', bordered ? 'fs-card--bordered' : '', className].filter(Boolean).join(' ')}
      style={style}
    >
      {hasHeader && (
        <div className="fs-card__header">
          <div className="fs-card__header-left">
            {title && <span className="fs-card__title">{title}</span>}
            {subtitle && <span className="fs-card__subtitle">{subtitle}</span>}
          </div>
          {headerRight && (
            <div className="fs-card__header-right">{headerRight}</div>
          )}
        </div>
      )}
      <div className={['fs-card__body', noPadding ? 'fs-card__body--no-padding' : '', bodyClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
      {footer && (
        <div className="fs-card__footer">{footer}</div>
      )}
    </div>
  );
};
