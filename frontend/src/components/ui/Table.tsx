import React, { useMemo } from 'react';
import './Table.css';

export interface Column<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  minWidth?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyField?: string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  onRowClick?: (row: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  density?: 'compact' | 'default' | 'relaxed';
  highlightOnHover?: boolean;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
}

function SortIcon({ dir }: { dir?: 'asc' | 'desc' | null }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 2L8 6H2L5 2Z" fill={dir === 'asc' ? 'currentColor' : 'rgba(100,116,139,0.4)'} />
      <path d="M5 8L2 4H8L5 8Z" fill={dir === 'desc' ? 'currentColor' : 'rgba(100,116,139,0.4)'} />
    </svg>
  );
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id',
  sortKey,
  sortDir,
  onSort,
  onRowClick,
  loading = false,
  emptyMessage = 'No data',
  stickyHeader = true,
  density = 'default',
  highlightOnHover = true,
  className = '',
  rowClassName,
}: TableProps<T>) {
  const colStyle = useMemo(() => (col: Column<T>) => ({
    width: col.width,
    minWidth: col.minWidth,
    textAlign: col.align ?? 'left' as const,
  }), []);

  return (
    <div className={['fs-table-wrapper', className].filter(Boolean).join(' ')}>
      <table className={['fs-table', `fs-table--${density}`, stickyHeader ? 'fs-table--sticky-header' : ''].filter(Boolean).join(' ')}>
        <thead className="fs-table__head">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={['fs-table__th', col.sortable ? 'fs-table__th--sortable' : '', col.className ?? ''].filter(Boolean).join(' ')}
                style={colStyle(col)}
                onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
              >
                <span className="fs-table__th-inner">
                  <span className="fs-table__th-label">{col.header}</span>
                  {col.sortable && (
                    <SortIcon dir={sortKey === col.key ? (sortDir ?? null) : null} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="fs-table__body">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="fs-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="fs-table__td">
                    <span className="fs-skeleton fs-skeleton--text" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="fs-table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={String(row[keyField] ?? rowIdx)}
                className={[
                  'fs-table__row',
                  highlightOnHover ? 'fs-table__row--hoverable' : '',
                  onRowClick ? 'fs-table__row--clickable' : '',
                  rowClassName?.(row, rowIdx) ?? '',
                ].filter(Boolean).join(' ')}
                onClick={onRowClick ? () => onRowClick(row, rowIdx) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={['fs-table__td', col.className ?? ''].filter(Boolean).join(' ')}
                    style={colStyle(col)}
                  >
                    {col.render
                      ? col.render(row[col.key], row, rowIdx)
                      : (row[col.key] as React.ReactNode)
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
