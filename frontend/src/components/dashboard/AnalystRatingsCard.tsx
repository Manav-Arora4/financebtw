import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const AnalystRatingsCard: React.FC = () => {
  const { selectedSymbol } = useAppStore();

  if (!selectedSymbol) return null;
  const clean = selectedSymbol.replace('.NS', '').replace('.BO', '');

  return (
    <div className="financebtw-card analyst-ratings-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Analyst Consensus</h3>
        <span className="card-sub-badge">Brokerage Targets</span>
      </div>

      <div className="card-wip-state">
        <div className="wip-icon-badge">🎯</div>
        <h4 className="wip-title">Institutional Consensus Estimates</h4>
        <p className="wip-desc">
          Aggregated sell-side analyst ratings, target price consensus, and earnings revisions for <strong>{clean}</strong> are not yet streamed by the free market data provider.
        </p>
        <div className="wip-status-pill">
          <span className="status-dot slate" />
          <span>Brokerage Feed — Work in Progress</span>
        </div>
      </div>
    </div>
  );
};
