import React from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const PortfolioPageContent: React.FC = () => {
  const holdings = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', qty: 50, avg: '2,750.00', last: '2,985.50', value: '1,49,275', weight: 31.0, beta: 0.92, pnl: '+11,775', pnlPct: '+8.56%', pos: true },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', qty: 25, avg: '3,950.00', last: '4,190.00', value: '1,04,750', weight: 21.7, beta: 0.84, pnl: '+6,000', pnlPct: '+6.08%', pos: true },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', qty: 70, avg: '1,520.00', last: '1,645.20', value: '1,15,164', weight: 23.9, beta: 1.08, pnl: '+8,764', pnlPct: '+8.24%', pos: true },
    { symbol: 'INFY.NS', name: 'Infosys Limited', qty: 60, avg: '1,680.00', last: '1,875.40', value: '1,12,524', weight: 23.4, beta: 0.98, pnl: '+11,724', pnlPct: '+11.63%', pos: true },
  ];

  return (
    <div className="terminal-portfolio-container">
      {/* Top Header */}
      <div className="portfolio-top-bar">
        <div>
          <h2 className="portfolio-heading">PORTFOLIO &amp; RISK ANALYTICS</h2>
          <p className="portfolio-sub">Track holdings, measure Value at Risk (VaR), beta sensitivity, and performance attribution</p>
        </div>
        <div className="portfolio-actions">
          <button className="btn-add-pos">[+] Add Holding</button>
          <button className="btn-export-rep">&lt;Export Risk Report&gt;</button>
        </div>
      </div>

      {/* Portfolio Top Metrics Cards */}
      <div className="portfolio-stats-grid">
        <div className="metric-card">
          <span className="metric-label">PORTFOLIO VALUATION</span>
          <span className="metric-val-main pos">₹4,81,713.00</span>
          <div className="metric-sub pos">UNREALIZED P&amp;L: +₹38,263.00 (+8.63%)</div>
        </div>

        <div className="metric-card">
          <span className="metric-label">VALUE AT RISK (95% 1-DAY)</span>
          <span className="metric-val-main neg">-1.42% (₹6,840)</span>
          <div className="metric-sub">EXPECTED SHORTFALL (CVaR): -2.18%</div>
        </div>

        <div className="metric-card">
          <span className="metric-label">PORTFOLIO BETA</span>
          <span className="metric-val-main">0.94x</span>
          <div className="metric-sub">LOWER VOLATILITY THAN NIFTY 50</div>
        </div>

        <div className="metric-card">
          <span className="metric-label">SHARPE &amp; SORTINO RATIO</span>
          <span className="metric-val-main pos">1.82 / 2.45</span>
          <div className="metric-sub">EXCELLENT RISK-ADJUSTED RETURNS</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="portfolio-holdings-panel">
        <div className="panel-header-line">
          <span className="panel-hdr-title">CURRENT POSITIONS &amp; RISK ATTRIBUTION</span>
          <span className="doc-count-badge">4 OPEN POSITIONS</span>
        </div>

        <div className="table-wrapper">
          <table className="terminal-table-full">
            <thead>
              <tr>
                <th>ASSET / SECURITY</th>
                <th className="num">QTY</th>
                <th className="num">AVG BUY PRICE</th>
                <th className="num">CURRENT PRICE</th>
                <th className="num">TOTAL VALUE</th>
                <th>WEIGHT (%)</th>
                <th className="num">BETA</th>
                <th className="num">UNREALIZED P&amp;L</th>
                <th className="num">% RETURN</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol} className="holding-row">
                  <td className="holding-name-cell">
                    <strong>{h.symbol}</strong>
                    <div className="holding-sub-name">{h.name}</div>
                  </td>
                  <td className="num">{h.qty}</td>
                  <td className="num">₹{h.avg}</td>
                  <td className="num bold">₹{h.last}</td>
                  <td className="num bold">₹{h.value}</td>
                  <td>
                    <div className="weight-bar-box">
                      <div className="weight-fill-bar" style={{ width: `${h.weight * 2}%` }}></div>
                      <span className="weight-val-text">{h.weight}%</span>
                    </div>
                  </td>
                  <td className="num">{h.beta}</td>
                  <td className="num pos bold">{h.pnl}</td>
                  <td className="num pos bold">[{h.pnlPct}]</td>
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
