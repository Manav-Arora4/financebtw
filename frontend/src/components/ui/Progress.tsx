import React from 'react';
import './Progress.css';

export interface ProgressBarProps {
  value: number;         /* 0–100 */
  max?: number;
  color?: 'positive' | 'negative' | 'warning' | 'info' | 'brand' | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  label?: string;
  showValue?: boolean;
  className?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'brand',
  size = 'sm',
  label,
  showValue = false,
  className = '',
  animated = false,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={['fs-progress', className].filter(Boolean).join(' ')}>
      {(label || showValue) && (
        <div className="fs-progress__header">
          {label && <span className="fs-progress__label">{label}</span>}
          {showValue && <span className="fs-progress__value">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={['fs-progress__track', `fs-progress__track--${size}`].filter(Boolean).join(' ')}>
        <div
          className={['fs-progress__fill', `fs-progress__fill--${color}`, animated ? 'fs-progress__fill--animated' : ''].filter(Boolean).join(' ')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export interface CircularProgressProps {
  value: number;         /* 0–100 */
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 40,
  strokeWidth = 3,
  color = 'var(--accent)',
  className = '',
  children,
}) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = circ * (1 - pct / 100);

  return (
    <div className={['fs-circular-progress', className].filter(Boolean).join(' ')} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-surface-3)" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      {children && <div className="fs-circular-progress__content">{children}</div>}
    </div>
  );
};
