import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../api/client';

interface LiveRatios {
  symbol: string;
  pe_ratio?: number | null;
  pb_ratio?: number | null;
  ps_ratio?: number | null;
  ev_ebitda?: number | null;
  roe?: number | null;
  roa?: number | null;
  debt_to_equity?: number | null;
  current_ratio?: number | null;
  dividend_yield?: number | null;
  eps?: number | null;
  source?: string;
}

export const KeyMetricsCard: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [ratios, setRatios] = useState<LiveRatios | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selectedSymbol) return;
    let isMounted = true;
    setLoading(true);
    setError(false);

    apiClient
      .get<LiveRatios>(`/api/v1/market/ratios/${selectedSymbol}`)
      .then((res) => {
        if (isMounted && res.data) {
          setRatios(res.data);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

  if (!selectedSymbol) return null;

  const rows = [
    { label: 'P/E Ratio (TTM)', val: ratios?.pe_ratio != null ? `${ratios.pe_ratio.toFixed(2)}x` : '—', desc: 'Price to Earnings' },
    { label: 'Price / Book (P/B)', val: ratios?.pb_ratio != null ? `${ratios.pb_ratio.toFixed(2)}x` : '—', desc: 'Price to Book Value' },
    { label: 'Price / Sales (P/S)', val: ratios?.ps_ratio != null ? `${ratios.ps_ratio.toFixed(2)}x` : '—', desc: 'Price to Sales' },
    { label: 'EV / EBITDA', val: ratios?.ev_ebitda != null ? `${ratios.ev_ebitda.toFixed(2)}x` : '—', desc: 'Enterprise Value Multiple' },
    { label: 'Return on Equity (ROE)', val: ratios?.roe != null ? `${(ratios.roe * 100).toFixed(2)}%` : '—', desc: 'Net Profit / Net Worth' },
    { label: 'Return on Assets (ROA)', val: ratios?.roa != null ? `${(ratios.roa * 100).toFixed(2)}%` : '—', desc: 'Net Profit / Total Assets' },
    { label: 'Debt to Equity', val: ratios?.debt_to_equity != null ? ratios.debt_to_equity.toFixed(2) : '—', desc: 'Total Debt / Equity' },
    { label: 'Current Ratio', val: ratios?.current_ratio != null ? `${ratios.current_ratio.toFixed(2)}x` : '—', desc: 'Liquidity Multiple' },
    { label: 'Dividend Yield', val: ratios?.dividend_yield != null ? `${ratios.dividend_yield.toFixed(2)}%` : '—', desc: 'Annualized Payout' },
    { label: 'EPS (TTM)', val: ratios?.eps != null ? `₹${ratios.eps.toFixed(2)}` : '—', desc: 'Earnings Per Share' },
  ];

  return (
    <div className="financebtw-card key-metrics-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Key Financial Ratios</h3>
        {ratios?.source && <span className="card-sub-badge">{ratios.source}</span>}
      </div>

      {loading ? (
        <div className="card-loading-state">
          <div className="card-loading-spinner" />
          <span>Fetching live ratios from market provider...</span>
        </div>
      ) : error ? (
        <div className="card-notice-empty">
          <span className="notice-icon">ℹ</span>
          <span>Financial ratios stream temporarily unavailable for {selectedSymbol}</span>
        </div>
      ) : (
        <div className="metrics-table-scroll">
          <table className="metrics-compact-table">
            <thead>
              <tr>
                <th>Financial Ratio</th>
                <th>Description</th>
                <th className="num">Reported Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="metric-name-text">{r.label}</td>
                  <td className="text-muted text-sm">{r.desc}</td>
                  <td className="num bold">{r.val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
