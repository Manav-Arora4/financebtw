import React, { useState } from 'react';
import { IconTradingView } from '../icons/Icons';

export const CandlestickChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX'>('1D');

  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'] as const;

  // Rich continuous realistic dataset with 65 candlestick periods
  const candles = [
    { o: 194.2, h: 194.8, l: 194.0, c: 194.6, vol: 15, isGreen: true },
    { o: 194.6, h: 195.1, l: 194.4, c: 195.0, vol: 18, isGreen: true },
    { o: 195.0, h: 195.3, l: 194.7, c: 194.9, vol: 12, isGreen: false },
    { o: 194.9, h: 195.5, l: 194.6, c: 195.4, vol: 24, isGreen: true },
    { o: 195.4, h: 195.9, l: 195.2, c: 195.8, vol: 30, isGreen: true },
    { o: 195.8, h: 196.2, l: 195.5, c: 196.0, vol: 19, isGreen: true },
    { o: 196.0, h: 196.3, l: 195.4, c: 195.6, vol: 22, isGreen: false },
    { o: 195.6, h: 195.8, l: 194.9, c: 195.1, vol: 28, isGreen: false },
    { o: 195.1, h: 195.4, l: 194.5, c: 194.7, vol: 35, isGreen: false },
    { o: 194.7, h: 195.0, l: 194.1, c: 194.3, vol: 40, isGreen: false },
    { o: 194.3, h: 194.6, l: 193.5, c: 193.8, vol: 45, isGreen: false },
    { o: 193.8, h: 194.4, l: 193.6, c: 194.2, vol: 32, isGreen: true },
    { o: 194.2, h: 194.7, l: 194.0, c: 194.5, vol: 26, isGreen: true },
    { o: 194.5, h: 194.8, l: 193.9, c: 194.1, vol: 21, isGreen: false },
    { o: 194.1, h: 194.5, l: 193.7, c: 194.4, vol: 18, isGreen: true },
    { o: 194.4, h: 195.0, l: 194.2, c: 194.9, vol: 29, isGreen: true },
    { o: 194.9, h: 195.3, l: 194.6, c: 195.1, vol: 31, isGreen: true },
    { o: 195.1, h: 195.7, l: 194.9, c: 195.6, vol: 38, isGreen: true },
    { o: 195.6, h: 196.1, l: 195.4, c: 195.9, vol: 42, isGreen: true },
    { o: 195.9, h: 196.4, l: 195.7, c: 196.2, vol: 50, isGreen: true },
    { o: 196.2, h: 196.5, l: 195.6, c: 195.8, vol: 25, isGreen: false },
    { o: 195.8, h: 196.0, l: 195.1, c: 195.3, vol: 33, isGreen: false },
    { o: 195.3, h: 195.5, l: 194.6, c: 194.8, vol: 39, isGreen: false },
    { o: 194.8, h: 195.2, l: 194.3, c: 194.5, vol: 44, isGreen: false },
    { o: 194.5, h: 194.9, l: 193.8, c: 194.0, vol: 48, isGreen: false },
    { o: 194.0, h: 194.4, l: 193.2, c: 193.5, vol: 55, isGreen: false },
    { o: 193.5, h: 194.0, l: 192.9, c: 193.2, vol: 62, isGreen: false },
    { o: 193.2, h: 193.6, l: 192.5, c: 192.8, vol: 70, isGreen: false },
    { o: 192.8, h: 193.5, l: 192.7, c: 193.3, vol: 42, isGreen: true },
    { o: 193.3, h: 193.9, l: 193.0, c: 193.7, vol: 36, isGreen: true },
    { o: 193.7, h: 194.2, l: 193.4, c: 194.0, vol: 31, isGreen: true },
    { o: 194.0, h: 194.5, l: 193.8, c: 194.3, vol: 28, isGreen: true },
    { o: 194.3, h: 194.8, l: 194.1, c: 194.6, vol: 35, isGreen: true },
    { o: 194.6, h: 195.2, l: 194.4, c: 195.0, vol: 45, isGreen: true },
    { o: 195.0, h: 195.6, l: 194.8, c: 195.4, vol: 52, isGreen: true },
    { o: 195.4, h: 195.8, l: 195.0, c: 195.3, vol: 27, isGreen: false },
    { o: 195.3, h: 195.9, l: 195.1, c: 195.7, vol: 38, isGreen: true },
    { o: 195.7, h: 196.3, l: 195.5, c: 196.1, vol: 44, isGreen: true },
    { o: 196.1, h: 196.7, l: 195.9, c: 196.5, vol: 58, isGreen: true },
    { o: 196.5, h: 197.1, l: 196.2, c: 196.9, vol: 64, isGreen: true },
    { o: 196.9, h: 197.4, l: 196.6, c: 197.2, vol: 72, isGreen: true },
    { o: 197.2, h: 197.8, l: 197.0, c: 197.5, vol: 80, isGreen: true },
    { o: 197.5, h: 198.0, l: 197.2, c: 197.8, vol: 85, isGreen: true },
    { o: 197.8, h: 198.2, l: 197.3, c: 197.6, vol: 45, isGreen: false },
    { o: 197.6, h: 198.1, l: 197.4, c: 197.9, vol: 55, isGreen: true },
    { o: 197.9, h: 198.5, l: 197.7, c: 198.3, vol: 68, isGreen: true },
  ];

  // Helper to map price to Y coordinate in svg viewbox 0 0 780 240
  const minP = 188.0;
  const maxP = 200.0;
  const chartHeight = 240;
  const getY = (p: number) => chartHeight - ((p - minP) / (maxP - minP)) * (chartHeight - 50) - 30;

  const totalCandles = candles.length;
  const svgWidth = 780;
  const stepX = (svgWidth - 70) / totalCandles;

  return (
    <div className="tradingview-chart-panel">
      {/* Top Chart Navigation & Controls */}
      <div className="chart-top-controls-bar">
        {/* Timeframe Selectors */}
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

        {/* Dropdown Tools */}
        <div className="chart-options-group">
          <button className="btn-chart-dropdown">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>
            <span>Candles</span>
            <span className="dropdown-arrow">▾</span>
          </button>
          <button className="btn-chart-dropdown">
            <span>Indicators</span>
            <span className="dropdown-arrow">▾</span>
          </button>
          <button className="btn-chart-icon-tool" title="Chart Settings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
          <button className="btn-chart-icon-tool" title="Take Screenshot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
        </div>
      </div>

      {/* Main Chart Body + Left Toolbar */}
      <div className="chart-body-with-toolbar">
        {/* Left Drawing Toolbar */}
        <div className="chart-drawing-toolbar">
          <button className="tool-btn active" title="Crosshair">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </button>
          <button className="tool-btn" title="Trendline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="20" x2="20" y2="4"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="4" r="2"/></svg>
          </button>
          <button className="tool-btn" title="Fibonacci">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <button className="tool-btn" title="Text Note">
            <span style={{ fontWeight: 800, fontSize: 13 }}>T</span>
          </button>
          <button className="tool-btn" title="Brush">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
          </button>
          <button className="tool-btn" title="Measure">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.3 15.3l-6.6-6.6a2 2 0 0 0-2.8 0L3.3 17.3a2 2 0 0 0 0 2.8l.6.6a2 2 0 0 0 2.8 0l8.6-8.6"/></svg>
          </button>
          <button className="tool-btn" title="Zoom">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
        </div>

        {/* Chart Viewport Canvas */}
        <div className="chart-canvas-viewport">
          {/* OHLC Banner */}
          <div className="chart-ohlc-banner">
            <span className="ohlc-metric">O <strong className="val">194.51</strong></span>
            <span className="ohlc-metric">H <strong className="val">196.00</strong></span>
            <span className="ohlc-metric">L <strong className="val">194.35</strong></span>
            <span className="ohlc-metric">C <strong className="val">195.83</strong></span>
            <span className="ohlc-delta pos">▲ 2.42 (1.25%)</span>
            <span className="ohlc-vol">Vol <strong className="vol-val">52.73M</strong></span>
          </div>

          {/* SVG Candlestick & Volume Visualization */}
          <div className="svg-candlestick-wrapper">
            <svg viewBox="0 0 780 240" className="candlestick-svg" preserveAspectRatio="none">
              {/* Horizontal Price Grid Lines */}
              <line x1="0" y1="35" x2="780" y2="35" stroke="#161f30" strokeDasharray="3,3" />
              <line x1="0" y1="85" x2="780" y2="85" stroke="#161f30" strokeDasharray="3,3" />
              <line x1="0" y1="135" x2="780" y2="135" stroke="#161f30" strokeDasharray="3,3" />
              <line x1="0" y1="185" x2="780" y2="185" stroke="#161f30" strokeDasharray="3,3" />

              {/* Right Y Axis Price Labels */}
              <text x="735" y="39" fill="#64748b" fontSize="10" fontFamily="Inter">198.00</text>
              <text x="735" y="89" fill="#64748b" fontSize="10" fontFamily="Inter">196.00</text>
              <text x="735" y="139" fill="#64748b" fontSize="10" fontFamily="Inter">194.00</text>
              <text x="735" y="189" fill="#64748b" fontSize="10" fontFamily="Inter">190.00</text>
              <text x="735" y="215" fill="#64748b" fontSize="10" fontFamily="Inter">188.00</text>

              {/* Volume Bars at bottom */}
              {candles.map((c, i) => {
                const posX = 15 + i * stepX;
                const vHeight = Math.min(c.vol * 0.45, 45);
                return (
                  <rect
                    key={`vol-${i}`}
                    x={posX - 3}
                    y={225 - vHeight}
                    width={6}
                    height={vHeight}
                    fill={c.isGreen ? '#22c55e' : '#ef4444'}
                    opacity={0.35}
                  />
                );
              })}

              {/* Candlestick Wicks & Bodies */}
              {candles.map((c, i) => {
                const posX = 15 + i * stepX;
                const yHigh = getY(c.h);
                const yLow = getY(c.l);
                const yOpen = getY(c.o);
                const yClose = getY(c.c);
                const topBody = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(Math.abs(yClose - yOpen), 3);
                const color = c.isGreen ? '#22c55e' : '#ef4444';

                return (
                  <g key={`candle-${i}`}>
                    {/* Wick */}
                    <line
                      x1={posX}
                      y1={yHigh}
                      x2={posX}
                      y2={yLow}
                      stroke={color}
                      strokeWidth={1.2}
                    />
                    {/* Body */}
                    <rect
                      x={posX - 4}
                      y={topBody}
                      width={8}
                      height={bodyHeight}
                      fill={color}
                      rx={1}
                    />
                  </g>
                );
              })}

              {/* Current Price Dashed Marker Line Across Entire Canvas */}
              <line x1="0" y1="88" x2="780" y2="88" stroke="#22c55e" strokeDasharray="4,4" strokeWidth={1.5} />
              <rect x="715" y="78" width="60" height="20" fill="#22c55e" rx={3} />
              <text x="724" y="92" fill="#000" fontSize="10" fontWeight="800" fontFamily="Inter">
                195.83
              </text>
            </svg>

            {/* TradingView watermark badge */}
            <div className="tradingview-watermark-tag">
              <IconTradingView size={16} />
              <span>TradingView</span>
            </div>
          </div>

          {/* Time Axis Labels */}
          <div className="chart-bottom-time-axis">
            <span>09:30</span>
            <span>10:30</span>
            <span>11:30</span>
            <span>12:30</span>
            <span>13:30</span>
            <span>14:30</span>
            <span>15:30</span>
            <span>16:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
