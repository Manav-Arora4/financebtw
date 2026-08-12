import React from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const PortfolioPageContent: React.FC = () => {
  const holdings = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', qty: 50, avgPrice: '₹2,750.00', currentPrice: '₹2,985.50', value: '₹1,49,275', pnl: '+₹11,775 (+8.56%)' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', qty: 25, avgPrice: '₹3,950.00', currentPrice: '₹4,190.00', value: '₹1,04,750', pnl: '+₹6,000 (+6.08%)' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', qty: 70, avgPrice: '₹1,520.00', currentPrice: '₹1,645.20', value: '₹1,15,164', pnl: '+₹8,764 (+8.24%)' },
    { symbol: 'INFY.NS', name: 'Infosys Limited', qty: 60, avgPrice: '₹1,680.00', currentPrice: '₹1,875.40', value: '₹1,12,524', pnl: '+₹11,724 (+11.63%)' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">[Portfolio Risk &amp; Holdings Engine]</h2>
          <p className="page-subtitle">Real-time valuation, Sector Beta Analysis, and Sharpe Ratio Calculations</p>
        </div>
        <button className="btn btn-primary btn-sm">
          [+] Add Holding
        </button>
      </div>

      {/* Portfolio Top Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card glass">
          <div className="stat-label">Total Valuation</div>
          <div className="stat-val">₹4,81,713</div>
          <div className="text-positive" style={{ marginTop: '0.25rem' }}>
            +[₹38,263 (+8.63%)]
          </div>
        </div>
        <div className="card glass">
          <div className="stat-label">Portfolio Beta</div>
          <div className="stat-val">0.94</div>
          <div className="text-muted" style={{ marginTop: '0.25rem' }}>
            Lower volatility than Nifty 50
          </div>
        </div>
        <div className="card glass">
          <div className="stat-label">Sharpe Ratio</div>
          <div className="stat-val">1.82</div>
          <div className="text-positive" style={{ marginTop: '0.25rem' }}>
            High risk-adjusted returns
          </div>
        </div>
        <div className="card glass">
          <div className="stat-label">Diversification</div>
          <div className="stat-val">3 Sectors</div>
          <div className="text-muted" style={{ marginTop: '0.25rem' }}>
            Tech (45%), Energy (31%), BFSI (24%)
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card glass">
        <div className="card-header">
          <h3 className="card-title">Active Portfolio Holdings</h3>
          <span className="badge badge-success">4 Positions Open</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Avg Buy Price</th>
                <th>Current Price</th>
                <th>Total Value</th>
                <th>Unrealized P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol}>
                  <td>
                    <strong>{h.symbol}</strong>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{h.name}</div>
                  </td>
                  <td>{h.qty}</td>
                  <td>{h.avgPrice}</td>
                  <td>{h.currentPrice}</td>
                  <td><strong>{h.value}</strong></td>
                  <td><span className="text-positive">[{h.pnl}]</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const PortfolioPage: React.FC = () => {
  return (
    <ProtectedRoute featureName="Portfolio Risk Engine">
      <PortfolioPageContent />
    </ProtectedRoute>
  );
};
