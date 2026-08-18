import React from 'react';
import type { FinancialTableData } from './types';
import './ResearchFinancialTable.css';

interface Props {
  table: FinancialTableData;
}

export const ResearchFinancialTable: React.FC<Props> = ({ table }) => {
  if (!table || !table.rows || table.rows.length === 0) return null;

  return (
    <div className="research-fin-table-card">
      {table.title && (
        <div className="fin-table-title-row">
          <span className="fin-table-title">{table.title}</span>
          <span className="fin-table-tag">Institutional Breakdown</span>
        </div>
      )}

      <div className="fin-table-scroll">
        <table className="fin-data-table">
          <thead>
            <tr>
              {table.columns.map((col, i) => (
                <th key={col} className={i === 0 ? '' : 'num'}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, idx) => (
              <tr key={idx} className="fin-data-row">
                <td className="metric-cell">{row.metric}</td>
                {row.q3_fy25 && <td className="num bold">{row.q3_fy25}</td>}
                {row.q2_fy25 && <td className="num">{row.q2_fy25}</td>}
                {row.q3_fy24 && <td className="num text-muted">{row.q3_fy24}</td>}
                {row.yoy && (
                  <td className={`num bold ${row.isPositive ? 'pos' : 'neg'}`}>
                    {row.yoy}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
