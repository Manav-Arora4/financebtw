import React from 'react';
import './StatusIndicator.css';

export type MarketStatus = 'open' | 'closed' | 'pre-market' | 'post-market' | 'holiday';

const STATUS_CONFIG: Record<MarketStatus, { label: string; color: string }> = {
  'open':        { label: 'Market Open',       color: 'positive' },
  'closed':      { label: 'Market Closed',     color: 'negative' },
  'pre-market':  { label: 'Pre-Market',        color: 'warning'  },
  'post-market': { label: 'Post-Market',       color: 'warning'  },
  'holiday':     { label: 'Market Holiday',    color: 'subdued'  },
};

export interface StatusIndicatorProps {
  status: MarketStatus;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showLabel = true,
  pulse = true,
  className = '',
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <span className={['fs-status', `fs-status--${config.color}`, className].filter(Boolean).join(' ')}>
      <span className={['fs-status__dot', pulse && status === 'open' ? 'fs-status__dot--pulse' : ''].filter(Boolean).join(' ')} />
      {showLabel && <span className="fs-status__label">{config.label}</span>}
    </span>
  );
};
