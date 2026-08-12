import React, { useState } from 'react';

export const CandlestickChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX'>('1D');

  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'] as const;

  // Realistic sample candlestick data points: [x, open, high, low, close, vol, isGreen]
  const candles = [
    { x: 30, o: 194.5, h: 195.2, l: 194.2, c: 195.0, vol: 15, isGreen: true },
    { x: 55, o: 195.0, h: 195.6, l: 194.8, c: 195.4, vol: 18, isGreen: true },
    { x: 80, o: 195.4, h: 195.8, l: 195.1, c: 195.3, vol: 12, isGreen: false },
    { x: 105, o: 195.3, h: 196.2, l: 195.0, c: 196.0, vol: 24, isGreen: true },
    { x: 130, o: 196.0, h: 196.5, l: 195.8, c: 196.4, vol: 30, isGreen: true },
    { x: 155, o: 196.4, h: 196.8, l: 196.1, c: 196.2, vol: 19, isGreen: false },
    { x: 180, o: 196.2, h: 196.4, l: 195.5, c: 195.7, vol: 22, isGreen: false },
    { x: 205, o: 195.7, h: 195.9, l: 194.8, c: 195.0, vol: 28, isGreen: false },
    { x: 230, o: 195.0, h: 195.3, l: 194.2, c: 194.5, vol: 35, isGreen: false },
    { x: 255, o: 194.5, h: 194.9, l: 193.8, c: 194.0, vol: 40, isGreen: false },
    { x: 280, o: 194.0, h: 194.4, l: 193.2, c: 193.5, vol: 45, isGreen: false },
    { x: 305, o: 193.5, h: 194.2, l: 193.4, c: 194.1, vol: 32, isGreen: true },
    { x: 330, o: 194.1, h: 194.8, l: 193.9, c: 194.6, vol: 26, isGreen: true },
    { x: 355, o: 194.6, h: 194.7, l: 193.8, c: 194.0, vol: 21, isGreen: false },
    { x: 380, o: 194.0, h: 194.5, l: 193.5, c: 194.3, vol: 18, isGreen: true },
    { x: 405, o: 194.3, h: 195.0, l: 194.1, c: 194.8, vol: 29, isGreen: true },
    { x: 430, o: 194.8, h: 195.4, l: 194.6, c: 195.2, vol: 31, isGreen: true },
    { x: 455, o: 195.2, h: 195.8, l: 195.0, c: 195.7, vol: 38, isGreen: true },
    { x: 480, o: 195.7, h: 196.2, l: 195.5, c: 196.0, vol: 42, isGreen: true },
    { x: 505, o: 196.0, h: 196.6, l: 195.8, c: 196.5, vol: 50, isGreen: true },
    { x: 530, o: 196.5, h: 197.0, l: 196.3, c: 196.8, vol: 55, isGreen: true },
    { x: 555, o: 196.8, h: 197.4, l: 196.6, c: 197.2, vol: 62, isGreen: true },
  ];

  // Helper to map price to Y coordinate
  const minP = 188.0;
  const maxP = 198.0;
  const chartHeight = 220;
  const getY = (p: number) => chartHeight - ((p - minP) / (maxP - minP)) * (chartHeight - 40) - 20;

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
            <span>[::] Candles</span>
            <span className="dropdown-arrow">[v]</span>
          </button>
          <button className="btn-chart-dropdown">
            <span>Indicators</span>
            <span className="dropdown-arrow">[v]</span>
          </button>
          <button className="btn-chart-icon-tool" title="Chart Settings">
            <span>[CFG]</span>
          </button>
          <button className="btn-chart-icon-tool" title="Take Screenshot">
            <span>[IMG]</span>
          </button>
        </div>
      </div>

      {/* Main Chart Body + Left Toolbar */}
      <div className="chart-body-with-toolbar">
        {/* Left Drawing Toolbar */}
        <div className="chart-drawing-toolbar">
          <button className="tool-btn active" title="Crosshair">[+]</button>
          <button className="tool-btn" title="Trendline">[/]</button>
          <button className="tool-btn" title="Fibonacci">[=]</button>
          <button className="tool-btn" title="Text Note">[T]</button>
          <button className="tool-btn" title="Brush">[~]</button>
          <button className="tool-btn" title="Measure">[?]</button>
          <button className="tool-btn" title="Zoom">[+]</button>
        </div>

        {/* Chart Viewport Canvas */}
        <div className="chart-canvas-viewport">
          {/* OHLC Banner */}
          <div className="chart-ohlc-banner">
            <span className="ohlc-metric">O: <strong className="val">194.51</strong></span>
            <span className="ohlc-metric">H: <strong className="val">196.00</strong></span>
            <span className="ohlc-metric">L: <strong className="val">194.35</strong></span>
            <span className="ohlc-metric">C: <strong className="val">195.83</strong></span>
            <span className="ohlc-delta pos">▲ +2.42 (1.25%)</span>
            <span className="ohlc-vol">Vol: <strong>52.73M</strong></span>
          </div>

          {/* SVG Candlestick & Volume Visualization */}
          <div className="svg-candlestick-wrapper">
            <svg viewBox="0 0 600 240" className="candlestick-svg">
              {/* Horizontal Price Grid Lines */}
              <line x1="0" y1="30" x2="600" y2="30" stroke="#1b2438" strokeDasharray="3,3" />
              <line x1="0" y1="75" x2="600" y2="75" stroke="#1b2438" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#1b2438" strokeDasharray="3,3" />
              <line x1="0" y1="165" x2="600" y2="165" stroke="#1b2438" strokeDasharray="3,3" />

              {/* Volume Bars at bottom */}
              {candles.map((c, i) => (
                <rect
                  key={`vol-${i}`}
                  x={c.x - 4}
                  y={220 - c.vol * 0.7}
                  width={8}
                  height={c.vol * 0.7}
                  fill={c.isGreen ? '#22c55e' : '#ef4444'}
                  opacity={0.4}
                />
              ))}

              {/* Candlestick Wicks & Bodies */}
              {candles.map((c, i) => {
                const yHigh = getY(c.h);
                const yLow = getY(c.l);
                const yOpen = getY(c.o);
                const yClose = getY(c.c);
                const topBody = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);
                const color = c.isGreen ? '#22c55e' : '#ef4444';

                return (
                  <g key={`candle-${i}`}>
                    {/* Wick */}
                    <line
                      x1={c.x}
                      y1={yHigh}
                      x2={c.x}
                      y2={yLow}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    {/* Body */}
                    <rect
                      x={c.x - 5}
                      y={topBody}
                      width={10}
                      height={bodyHeight}
                      fill={color}
                      rx={1}
                    />
                  </g>
                );
              })}

              {/* Current Price Dashed Marker Line */}
              <line x1="0" y1="55" x2="600" y2="55" stroke="#22c55e" strokeDasharray="4,4" strokeWidth={1.5} />
              <rect x="530" y="45" width="60" height="20" fill="#22c55e" rx={3} />
              <text x="540" y="59" fill="#000" fontSize="11" fontWeight="800" fontFamily="Inter">
                195.83
              </text>
            </svg>
          </div>

          {/* Time & Price Axes Labels */}
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
