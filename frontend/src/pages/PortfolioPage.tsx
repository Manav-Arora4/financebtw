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
    <div className="terminal-portfolio-page">
      {/* Top Header */}
      <div className="terminal-page-header">
        <div className="header-title-block">
          <span className="terminal-code-tag">&lt;PORT&gt;</span>
          <div>
            <h2 className="terminal-title">PORTFOLIO &amp; RISK ANALYTICS WORKSTATION</h2>
            <p className="terminal-sub">Institutional Value at Risk (VaR), Stress Testing, Beta &amp; Multi-Factor Sensitivity</p>
          </div>
        </div>
        <div className="header-action-btns">
          <button className="btn-term-primary">&lt;ADD POSITION&gt;</button>
          <button className="btn-term-sec">&lt;EXPORT RISK REPORT&gt;</button>
        </div>
      </div>

      {/* Institutional Risk Matrix Grid */}
      <div className="terminal-metrics-grid">
        <div className="term-stat-card">
          <span className="term-stat-code">&lt;NAV&gt;</span>
          <span className="term-stat-lbl">TOTAL PORTFOLIO VALUATION</span>
          <span className="term-stat-val pos">₹4,81,713.00</span>
          <div className="term-stat-sub pos">UNREALIZED P&amp;L: +₹38,263.00 (+8.63%)</div>
        </div>

        <div className="term-stat-card">
          <span className="term-stat-code">&lt;VaR&gt;</span>
          <span className="term-stat-lbl">VALUE AT RISK (95% 1-DAY)</span>
          <span className="term-stat-val neg">-1.42% (₹6,840)</span>
          <div className="term-stat-sub">EXPECTED SHORTFALL (CVaR): -2.18%</div>
        </div>

        <div className="term-stat-card">
          <span className="term-stat-code">&lt;BETA&gt;</span>
          <span className="term-stat-lbl">PORTFOLIO WEIGHTED BETA</span>
          <span className="term-stat-val">0.94x</span>
          <div className="term-stat-sub">TRACKING ERROR vs NIFTY: 2.15%</div>
        </div>

        <div className="term-stat-card">
          <span className="term-stat-code">&lt;RATIOS&gt;</span>
          <span className="term-stat-lbl">SHARPE &amp; SORTINO RATIO</span>
          <span className="term-stat-val pos">1.82 / 2.45</span>
          <div className="term-stat-sub">TREYNOR RATIO: 12.4% | INFO: 0.78</div>
        </div>
      </div>

      {/* Holdings & Risk Attribution Table */}
      <div className="terminal-panel" style={{ marginTop: '1.25rem' }}>
        <div className="panel-header">
          <div className="panel-title-group">
            <span className="panel-code">&lt;POS&gt;</span>
            <span className="panel-title">PORTFOLIO POSITIONS &amp; RISK ATTRIBUTION</span>
          </div>
          <span className="source-tag">4 POSITIONS ACTIVE</span>
        </div>

        <div className="terminal-table-container">
          <table className="terminal-data-table">
            <thead>
              <tr>
                <th>TICKER</th>
                <th>SECURITY NAME</th>
                <th className="num">QTY</th>
                <th className="num">AVG BUY</th>
                <th className="num">LAST PX</th>
                <th className="num">TOTAL VALUE</th>
                <th>WEIGHT (%)</th>
                <th className="num">BETA</th>
                <th className="num">UNREALIZED P&amp;L</th>
                <th className="num">% RETURN</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.symbol} className="term-row">
                  <td className="ticker-cell">
                    <strong>{h.symbol}</strong>
                  </td>
                  <td className="name-cell">{h.name}</td>
                  <td className="num">{h.qty}</td>
                  <td className="num">₹{h.avg}</td>
                  <td className="num bold">₹{h.last}</td>
                  <td className="num bold">₹{h.value}</td>
                  <td>
                    <div className="weight-bar-wrapper">
                      <div className="weight-bar" style={{ width: `${h.weight * 2}%` }}></div>
                      <span className="weight-num">{h.weight}%</span>
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
