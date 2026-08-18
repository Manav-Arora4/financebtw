import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PortfolioSummaryCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="financebtw-card my-portfolio-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">My Portfolio</h3>
        <button
          className="btn-card-action-text"
          onClick={() => navigate('/portfolio')}
        >
          Portfolio &gt;
        </button>
      </div>

      <div className="card-wip-state">
        <div className="wip-icon-badge">💼</div>
        <h4 className="wip-title">No Active Holdings</h4>
        <p className="wip-desc">
          Add Indian stock holdings or connect your Demat account to track real-time portfolio P&amp;L, sector allocation, and dividend yields.
        </p>
        <button
          className="btn-orange-primary"
          style={{ marginTop: '8px', padding: '6px 14px', fontSize: '12px' }}
          onClick={() => navigate('/portfolio')}
        >
          + Add Holdings
        </button>
      </div>
    </div>
  );
};
