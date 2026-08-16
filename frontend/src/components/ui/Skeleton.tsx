import React from 'react';
import './Skeleton.css';

export type SkeletonVariant = 'text' | 'rect' | 'circle' | 'card' | 'row' | 'chart';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;        /* for 'text' variant */
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  lines = 3,
  className = '',
}) => {
  const style: React.CSSProperties = {
    width:  width  !== undefined ? (typeof width  === 'number' ? `${width}px`  : width)  : undefined,
    height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  if (variant === 'text') {
    return (
      <div className={['fs-skeleton-text-block', className].filter(Boolean).join(' ')}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className="fs-skeleton fs-skeleton--text"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={['fs-skeleton-row', className].filter(Boolean).join(' ')}>
        <span className="fs-skeleton fs-skeleton--text" style={{ width: '120px' }} />
        <span className="fs-skeleton fs-skeleton--text" style={{ width: '80px' }} />
        <span className="fs-skeleton fs-skeleton--text" style={{ width: '60px' }} />
        <span className="fs-skeleton fs-skeleton--text" style={{ width: '50px' }} />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={['fs-skeleton-chart', className].filter(Boolean).join(' ')} style={style}>
        <div className="fs-skeleton-chart__bars">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="fs-skeleton-chart__bar"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <span
      className={[
        'fs-skeleton',
        `fs-skeleton--${variant}`,
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    />
  );
};
