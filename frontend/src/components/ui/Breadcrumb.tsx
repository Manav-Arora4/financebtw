import React from 'react';
import './Breadcrumb.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const ChevronRight = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => (
  <nav aria-label="Breadcrumb" className={['fs-breadcrumb', className].filter(Boolean).join(' ')}>
    <ol className="fs-breadcrumb__list">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="fs-breadcrumb__item">
            {i > 0 && (
              <span className="fs-breadcrumb__sep" aria-hidden="true">
                <ChevronRight />
              </span>
            )}
            {isLast ? (
              <span className="fs-breadcrumb__current" aria-current="page">{item.label}</span>
            ) : item.onClick ? (
              <button className="fs-breadcrumb__link" onClick={item.onClick}>{item.label}</button>
            ) : item.href ? (
              <a className="fs-breadcrumb__link" href={item.href}>{item.label}</a>
            ) : (
              <span className="fs-breadcrumb__link">{item.label}</span>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
