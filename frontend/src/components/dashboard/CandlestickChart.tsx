import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../api/client';

interface PriceBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface HistoricalData {
  symbol: string;
  currency: string;
  interval: string;
  bars: PriceBar[];
}

export const CandlestickChart: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [timeframe, setTimeframe] = useState<'5D' | '1M' | '3M' | '6M' | '1Y'>('1M');
  const [history, setHistory] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const timeframes = ['5D', '1M', '3M', '6M', '1Y'] as const;

  const daysMap: Record<string, number> = {
    '5D': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
  };

  useEffect(() => {
    if (!selectedSymbol) return;
    let isMounted = true;
    setLoading(true);
    setError(false);

    const days = daysMap[timeframe] || 30;
    apiClient
      .get<HistoricalData>(`/api/v1/market/history/${selectedSymbol}?days=${days}&interval=1d`)
      .then((res) => {
        if (isMounted && res.data && res.data.bars) {
          setHistory(res.data);
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
  }, [selectedSymbol, timeframe]);

  if (!selectedSymbol) return null;

  const bars = history?.bars || [];
  const hasData = bars.length > 0;

  // Compute scale boundaries from real OHLC bars
  let minP = Infinity;
  let maxP = -Infinity;
  let maxVol = 1;

  bars.forEach((b) => {
    if (b.low < minP) minP = b.low;
    if (b.high > maxP) maxP = b.high;
    if (b.volume > maxVol) maxVol = b.volume;
  });

  if (minP === Infinity || maxP === -Infinity) {
    minP = 1000;
    maxP = 1500;
  }

  // Padding
  const priceRange = maxP - minP || 1;
  minP -= priceRange * 0.05;
  maxP += priceRange * 0.05;

  const chartHeight = 240;
  const svgWidth = 900;
  const getY = (p: number) =>
    chartHeight - ((p - minP) / (maxP - minP)) * (chartHeight - 65) - 30;

  const stepX = bars.length > 0 ? (svgWidth - 95) / bars.length : 10;
  const latestBar = bars[bars.length - 1];

  return (
    <div className="tradingview-chart-panel">
      {/* Top Chart Controls */}
      <div className="chart-top-controls-bar">
        <div className="chart-timeframe-group">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={`tf-pill-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        {latestBar && (
          <div className="chart-ohlc-summary">
            <span>O: <strong>{latestBar.open.toFixed(2)}</strong></span>
            <span>H: <strong>{latestBar.high.toFixed(2)}</strong></span>
            <span>L: <strong>{latestBar.low.toFixed(2)}</strong></span>
            <span>C: <strong>{latestBar.close.toFixed(2)}</strong></span>
            <span>Vol: <strong>{latestBar.volume.toLocaleString('en-IN')}</strong></span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="chart-loading-overlay">
          <div className="card-loading-spinner" />
          <span>Streaming real-time historical candlesticks for {selectedSymbol}...</span>
        </div>
      ) : error || !hasData ? (
        <div className="chart-empty-notice">
          <span className="notice-icon">📊</span>
          <span>Historical OHLCV price bars unavailable for {selectedSymbol} in current timeframe.</span>
        </div>
      ) : (
        <div className="chart-svg-main-wrapper">
          <svg viewBox={`0 0 ${svgWidth} ${chartHeight}`} className="tv-chart-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="volGradLive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="20" y1="40" x2={svgWidth - 75} y2="40" stroke="#162032" strokeDasharray="3,3" />
            <line x1="20" y1="90" x2={svgWidth - 75} y2="90" stroke="#162032" strokeDasharray="3,3" />
            <line x1="20" y1="140" x2={svgWidth - 75} y2="140" stroke="#162032" strokeDasharray="3,3" />
            <line x1="20" y1="190" x2={svgWidth - 75} y2="190" stroke="#162032" strokeDasharray="3,3" />

            {/* Right Y-Axis Price Labels */}
            <text x={svgWidth - 68} y="44" fill="#64748b" fontSize="10" fontFamily="monospace">
              ₹{maxP.toFixed(1)}
            </text>
            <text x={svgWidth - 68} y="115" fill="#64748b" fontSize="10" fontFamily="monospace">
              ₹{((maxP + minP) / 2).toFixed(1)}
            </text>
            <text x={svgWidth - 68} y="194" fill="#64748b" fontSize="10" fontFamily="monospace">
              ₹{minP.toFixed(1)}
            </text>

            {/* Candlesticks and Volume Bars */}
            {bars.map((bar, i) => {
              const x = 30 + i * stepX;
              const isGreen = bar.close >= bar.open;
              const candleColor = isGreen ? '#22c55e' : '#ef4444';

              const yHigh = getY(bar.high);
              const yLow = getY(bar.low);
              const yOpen = getY(bar.open);
              const yClose = getY(bar.close);

              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(Math.abs(yOpen - yClose), 2);
              const candleWidth = Math.max(Math.min(stepX * 0.65, 12), 3);

              // Volume bar
              const volHeight = (bar.volume / maxVol) * 45;
              const volY = chartHeight - volHeight - 20;

              return (
                <g key={bar.date}>
                  {/* Volume bar */}
                  <rect
                    x={x - candleWidth / 2}
                    y={volY}
                    width={candleWidth}
                    height={volHeight}
                    fill={isGreen ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                    rx="1"
                  />
                  {/* Upper & Lower Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    fill={candleColor}
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
