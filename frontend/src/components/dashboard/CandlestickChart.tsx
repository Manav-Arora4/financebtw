import React, { useState } from 'react';
import { IconTradingView } from '../icons/Icons';

export const CandlestickChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX'>('1D');

  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'] as const;

  // Realistic continuous candlestick dataset mapped to Indian equity prices (Reliance ~₹2950-3020)
  const candles = [
    { o: 2955, h: 2962, l: 2950, c: 2960, vol: 15, isGreen: true },
    { o: 2960, h: 2968, l: 2957, c: 2965, vol: 18, isGreen: true },
    { o: 2965, h: 2970, l: 2961, c: 2963, vol: 12, isGreen: false },
    { o: 2963, h: 2972, l: 2958, c: 2970, vol: 24, isGreen: true },
    { o: 2970, h: 2978, l: 2966, c: 2976, vol: 30, isGreen: true },
    { o: 2976, h: 2982, l: 2972, c: 2980, vol: 19, isGreen: true },
    { o: 2980, h: 2984, l: 2974, c: 2976, vol: 22, isGreen: false },
    { o: 2976, h: 2979, l: 2968, c: 2970, vol: 28, isGreen: false },
    { o: 2970, h: 2974, l: 2962, c: 2965, vol: 35, isGreen: false },
    { o: 2965, h: 2968, l: 2958, c: 2960, vol: 40, isGreen: false },
    { o: 2960, h: 2964, l: 2952, c: 2955, vol: 45, isGreen: false },
    { o: 2955, h: 2962, l: 2954, c: 2960, vol: 32, isGreen: true },
    { o: 2960, h: 2966, l: 2957, c: 2963, vol: 26, isGreen: true },
    { o: 2963, h: 2967, l: 2956, c: 2959, vol: 21, isGreen: false },
    { o: 2959, h: 2964, l: 2955, c: 2962, vol: 18, isGreen: true },
    { o: 2962, h: 2970, l: 2960, c: 2968, vol: 29, isGreen: true },
    { o: 2968, h: 2974, l: 2965, c: 2972, vol: 31, isGreen: true },
    { o: 2972, h: 2980, l: 2970, c: 2978, vol: 38, isGreen: true },
    { o: 2978, h: 2985, l: 2975, c: 2982, vol: 42, isGreen: true },
    { o: 2982, h: 2988, l: 2978, c: 2986, vol: 50, isGreen: true },
    { o: 2986, h: 2990, l: 2980, c: 2982, vol: 25, isGreen: false },
    { o: 2982, h: 2984, l: 2975, c: 2978, vol: 33, isGreen: false },
    { o: 2978, h: 2980, l: 2970, c: 2974, vol: 39, isGreen: false },
    { o: 2974, h: 2978, l: 2968, c: 2970, vol: 44, isGreen: false },
    { o: 2970, h: 2975, l: 2962, c: 2966, vol: 48, isGreen: false },
    { o: 2966, h: 2970, l: 2958, c: 2961, vol: 55, isGreen: false },
    { o: 2961, h: 2966, l: 2954, c: 2957, vol: 62, isGreen: false },
    { o: 2957, h: 2962, l: 2950, c: 2953, vol: 70, isGreen: false },
    { o: 2953, h: 2960, l: 2951, c: 2958, vol: 42, isGreen: true },
    { o: 2958, h: 2965, l: 2955, c: 2963, vol: 36, isGreen: true },
    { o: 2963, h: 2969, l: 2960, c: 2967, vol: 31, isGreen: true },
    { o: 2967, h: 2973, l: 2964, c: 2971, vol: 28, isGreen: true },
    { o: 2971, h: 2976, l: 2968, c: 2974, vol: 35, isGreen: true },
    { o: 2974, h: 2981, l: 2971, c: 2979, vol: 45, isGreen: true },
    { o: 2979, h: 2986, l: 2976, c: 2984, vol: 52, isGreen: true },
    { o: 2984, h: 2989, l: 2980, c: 2983, vol: 27, isGreen: false },
    { o: 2983, h: 2990, l: 2981, c: 2988, vol: 38, isGreen: true },
    { o: 2988, h: 2995, l: 2985, c: 2992, vol: 44, isGreen: true },
    { o: 2992, h: 3000, l: 2990, c: 2997, vol: 58, isGreen: true },
    { o: 2997, h: 3005, l: 2993, c: 3002, vol: 64, isGreen: true },
    { o: 3002, h: 3010, l: 2998, c: 3006, vol: 72, isGreen: true },
    { o: 3006, h: 3014, l: 3002, c: 3010, vol: 80, isGreen: true },
    { o: 3010, h: 3018, l: 3005, c: 3014, vol: 85, isGreen: true },
    { o: 3014, h: 3016, l: 3006, c: 3010, vol: 45, isGreen: false },
    { o: 3010, h: 3016, l: 3008, c: 3013, vol: 55, isGreen: true },
    { o: 3013, h: 3020, l: 3010, c: 3018, vol: 68, isGreen: true },
  ];

  // Helper to map price to Y coordinate in svg viewbox 0 0 900 240
  const minP = 2945.0;
  const maxP = 3025.0;
  const chartHeight = 240;
  const getY = (p: number) => chartHeight - ((p - minP) / (maxP - minP)) * (chartHeight - 65) - 30;

  const totalCandles = candles.length;
  const svgWidth = 900;
  const stepX = (svgWidth - 95) / totalCandles;

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
            <span style={{ fontWeight: 800, fontSize: 12 }}>T</span>
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
            <span className="ohlc-metric">O <strong className="val">2,958.00</strong></span>
            <span className="ohlc-metric">H <strong className="val">2,994.80</strong></span>
            <span className="ohlc-metric">L <strong className="val">2,952.10</strong></span>
            <span className="ohlc-metric">C <strong className="val">2,985.50</strong></span>
            <span className="ohlc-delta pos">▲ +32.10 (1.09%)</span>
            <span className="ohlc-vol">Vol <strong className="vol-val">6.42M</strong></span>
          </div>

          {/* SVG Candlestick & Volume Visualization */}
          <div className="svg-candlestick-wrapper">
            <svg viewBox="0 0 900 240" className="candlestick-svg" preserveAspectRatio="none">
              {/* Horizontal Price Grid Lines */}
              <line x1="0" y1="35" x2="900" y2="35" stroke="#162032" strokeDasharray="4,4" />
              <line x1="0" y1="85" x2="900" y2="85" stroke="#162032" strokeDasharray="4,4" />
              <line x1="0" y1="135" x2="900" y2="135" stroke="#162032" strokeDasharray="4,4" />
              <line x1="0" y1="185" x2="900" y2="185" stroke="#162032" strokeDasharray="4,4" />

              {/* Right Y Axis Price Labels */}
              <text x="835" y="39" fill="#94a3b8" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">3,020.00</text>
              <text x="835" y="89" fill="#94a3b8" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">3,000.00</text>
              <text x="835" y="139" fill="#94a3b8" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">2,980.00</text>
              <text x="835" y="189" fill="#94a3b8" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">2,960.00</text>
              <text x="835" y="225" fill="#94a3b8" fontSize="10.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">2,940.00</text>

              {/* Volume Bars at bottom */}
              {candles.map((c, i) => {
                const posX = 15 + i * stepX;
                const vHeight = Math.min(c.vol * 0.5, 45);
                return (
                  <rect
                    key={`vol-${i}`}
                    x={posX - 3}
                    y={225 - vHeight}
                    width={6}
                    height={vHeight}
                    fill={c.isGreen ? '#22c55e' : '#ef4444'}
                    opacity={0.35}
                    rx={1}
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
                const bodyHeight = Math.max(Math.abs(yClose - yOpen), 3.5);
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
                      strokeWidth={1.5}
                    />
                    {/* Body */}
                    <rect
                      x={posX - 4}
                      y={topBody}
                      width={8}
                      height={bodyHeight}
                      fill={color}
                      rx={1.5}
                    />
                  </g>
                );
              })}

              {/* Current Price Dashed Marker Line Across Entire Canvas */}
              <line x1="0" y1="95" x2="900" y2="95" stroke="#22c55e" strokeDasharray="4,4" strokeWidth={1.5} />
              <rect x="815" y="84" width="80" height="22" fill="#22c55e" rx={4} />
              <text x="822" y="99" fill="#000" fontSize="10.5" fontWeight="800" fontFamily="JetBrains Mono, monospace">
                2,985.50
              </text>
            </svg>

            {/* TradingView watermark badge */}
            <div className="tradingview-watermark-tag">
              <IconTradingView size={15} />
              <span>TradingView</span>
            </div>
          </div>

          {/* Time Axis Labels */}
          <div className="chart-bottom-time-axis">
            <span>09:15</span>
            <span>10:30</span>
            <span>11:30</span>
            <span>12:30</span>
            <span>13:30</span>
            <span>14:30</span>
            <span>15:15</span>
            <span>15:30</span>
          </div>
        </div>
      </div>
    </div>
  );
};
