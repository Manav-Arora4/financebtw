import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const FinancialsCard: React.FC = () => {
  const { selectedSymbol } = useAppStore();

  if (!selectedSymbol) return null;
  const clean = selectedSymbol.replace('.NS', '').replace('.BO', '');

  return (
    <div className="financebtw-card financials-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Financial Statements (Quarterly)</h3>
        <span className="card-sub-badge">NSE Filings</span>
      </div>

      <div className="card-wip-state">
        <div className="wip-icon-badge">📋</div>
        <h4 className="wip-title">Quarterly Financials Feed</h4>
        <p className="wip-desc">
          Automated parsing of quarterly balance sheet and income statement filings for <strong>{clean}</strong> is currently being integrated into the ingestion pipeline.
        </p>
        <div className="wip-status-pill">
          <span className="status-dot orange" />
          <span>Ingestion Pipeline — Work in Progress</span>
        </div>
      </div>
    </div>
  );
};
