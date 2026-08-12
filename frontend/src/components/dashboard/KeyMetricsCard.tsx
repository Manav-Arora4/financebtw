import React from 'react';

export const KeyMetricsCard: React.FC = () => {
  const metrics = [
    { metric: 'P/E Ratio (TTM)', current: '28.42', industry: '24.18', tag: 'High', isPos: false },
    { metric: 'PEG Ratio (5Y)', current: '2.36', industry: '1.85', tag: 'High', isPos: false },
    { metric: 'Price / Book', current: '44.21', industry: '10.12', tag: 'High', isPos: false },
    { metric: 'ROE (TTM)', current: '160.3%', industry: '28.7%', tag: 'High', isPos: true },
    { metric: 'ROIC (TTM)', current: '48.6%', industry: '18.9%', tag: 'High', isPos: true },
    { metric: 'Gross Margin', current: '45.9%', industry: '36.7%', tag: 'High', isPos: true },
    { metric: 'Operating Margin', current: '30.2%', industry: '18.4%', tag: 'High', isPos: true },
    { metric: 'Net Margin', current: '25.1%', industry: '12.6%', tag: 'High', isPos: true },
  ];

  return (
    <div className="finsight-card key-metrics-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Key Metrics</h3>
      </div>

      <div className="metrics-table-scroll">
        <table className="metrics-compact-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th className="num">Current</th>
              <th className="num">Industry Avg</th>
              <th className="tag-col">vs Industry</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.metric}>
                <td className="metric-name-text">{m.metric}</td>
                <td className="num bold">{m.current}</td>
                <td className="num text-muted">{m.industry}</td>
                <td className="tag-col">
                  <span className={`vs-industry-pill ${m.isPos ? 'green' : 'red'}`}>
                    {m.tag}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View all metrics &gt;</button>
      </div>
    </div>
  );
};
