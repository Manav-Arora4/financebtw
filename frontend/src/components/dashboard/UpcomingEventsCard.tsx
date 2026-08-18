import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const UpcomingEventsCard: React.FC = () => {
  const { selectedSymbol } = useAppStore();

  if (!selectedSymbol) return null;
  const clean = selectedSymbol.replace('.NS', '').replace('.BO', '');

  return (
    <div className="financebtw-card upcoming-events-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Corporate Actions</h3>
        <span className="card-sub-badge">NSE · BSE</span>
      </div>

      <div className="card-wip-state">
        <div className="wip-icon-badge">📅</div>
        <h4 className="wip-title">Corporate Filings &amp; AGM</h4>
        <p className="wip-desc">
          No scheduled earnings dates, dividend record dates, or board meetings reported for <strong>{clean}</strong> in the current calendar cycle.
        </p>
        <div className="wip-status-pill">
          <span className="status-dot slate" />
          <span>NSE Disclosures — Up to date</span>
        </div>
      </div>
    </div>
  );
};
