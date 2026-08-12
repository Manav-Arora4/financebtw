import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const MarketPage: React.FC = () => {
  const { selectedSymbol, setSelectedSymbol } = useAppStore();
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y' | '5Y'>('1D');

  const macroIndices = [
    { name: 'NIFTY 50', symbol: '^NSEI', px: '24,350.25', chg: '+185.40', pct: '+0.77%', pos: true },
    { name: 'BANK NIFTY', symbol: '^NSEBANK', px: '51,240.80', chg: '+410.20', pct: '+0.81%', pos: true },
    { name: 'BSE SENSEX', symbol: '^BSESN', px: '80,120.45', chg: '+590.10', pct: '+0.74%', pos: true },
    { name: 'INDIA VIX', symbol: '^INDIAVIX', px: '12.45', chg: '-0.65', pct: '-4.96%', pos: false },
    { name: 'BRENT CRUDE', symbol: 'BZ=F', px: '$78.30', chg: '+0.45', pct: '+0.58%', pos: true },
    { name: 'USD / INR', symbol: 'USDINR=X', px: '83.92', chg: '-0.04', pct: '-0.05%', pos: false },
  ];

  const watchlist = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', last: '2,985.50', chg: '+32.10', pct: '+1.09%', bid: '2,985.20', ask: '2,985.50', vol: '6.42M', pe: '28.4', cap: '20.2L Cr', pos: true, range52: 78 },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', last: '4,190.00', chg: '-15.50', pct: '-0.37%', bid: '4,189.50', ask: '4,190.00', vol: '2.18M', pe: '31.2', cap: '15.1L Cr', pos: false, range52: 85 },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', last: '1,645.20', chg: '+12.70', pct: '+0.78%', bid: '1,645.00', ask: '1,645.20', vol: '14.8M', pe: '19.5', cap: '12.5L Cr', pos: true, range52: 65 },
    { symbol: 'INFY.NS', name: 'Infosys Limited', last: '1,875.40', chg: '+24.30', pct: '+1.31%', bid: '1,875.00', ask: '1,875.40', vol: '8.35M', pe: '29.1', cap: '7.8L Cr', pos: true, range52: 90 },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Limited', last: '1,180.90', chg: '+13.40', pct: '+1.15%', bid: '1,180.50', ask: '1,180.90', vol: '11.2M', pe: '17.8', cap: '8.3L Cr', pos: true, range52: 88 },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd', last: '1,490.25', chg: '+6.65', pct: '+0.45%', bid: '1,490.00', ask: '1,490.25', vol: '4.91M', pe: '42.1', cap: '8.9L Cr', pos: true, range52: 92 },
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Ltd', last: '1,045.60', chg: '+18.20', pct: '+1.77%', bid: '1,045.20', ask: '1,045.60', vol: '9.74M', pe: '14.6', cap: '3.8L Cr', pos: true, range52: 82 },
    { symbol: 'SBIN.NS', name: 'State Bank of India', last: '824.50', chg: '-4.10', pct: '-0.49%', bid: '824.20', ask: '824.50', vol: '16.3M', pe: '10.8', cap: '7.3L Cr', pos: false, range52: 74 },
  ];

  const orderBookBids = [
    { px: '2,985.20', qty: '14,200', total: '14,200', depthPct: 85 },
    { px: '2,985.00', qty: '28,500', total: '42,700', depthPct: 100 },
    { px: '2,984.50', qty: '19,100', total: '61,800', depthPct: 65 },
    { px: '2,984.00', qty: '12,400', total: '74,200', depthPct: 45 },
    { px: '2,983.50', qty: '8,900', total: '83,100', depthPct: 30 },
  ];

  const orderBookAsks = [
    { px: '2,985.50', qty: '11,800', total: '11,800', depthPct: 70 },
    { px: '2,985.80', qty: '22,400', total: '34,200', depthPct: 90 },
    { px: '2,986.00', qty: '31,000', total: '65,200', depthPct: 100 },
    { px: '2,986.50', qty: '16,500', total: '81,700', depthPct: 55 },
    { px: '2,987.00', qty: '9,200', total: '90,900', depthPct: 35 },
  ];

  const newsWire = [
    { time: '14:52:10', ticker: 'RELIANCE', tag: 'EXPANSION', sentiment: 'BULLISH', headline: 'Reliance Retail signs strategic Master Distribution agreement for international luxury portfolio' },
    { time: '14:48:35', ticker: 'MACRO', tag: 'RBI MPC', sentiment: 'NEUTRAL', headline: 'RBI MPC Minutes: Inflation glide path aligned towards 4.0% target; liquidity remains comfortable' },
    { time: '14:35:12', ticker: 'FII/DII', tag: 'FLOWS', sentiment: 'BULLISH', headline: 'Provisional Cash Market: FII net bought +₹2,450.80 Cr; DII net bought +₹1,120.40 Cr today' },
    { time: '14:15:00', ticker: 'INFY', tag: 'CONTRACT', sentiment: 'BULLISH', headline: 'Infosys signs $450M multi-year digital transformation mandate with Tier-1 European enterprise' },
    { time: '13:58:22', ticker: 'TCS', tag: 'EARNINGS', sentiment: 'NEUTRAL', headline: 'TCS management reiterates BFSI recovery trajectory starting Q3 FY25' },
  ];

  return (
    <div className="terminal-market-page">
      {/* 1. Macro Top Ribbon */}
      <div className="terminal-macro-ribbon">
        {macroIndices.map((idx) => (
          <div key={idx.symbol} className="macro-cell">
            <span className="macro-name">{idx.name}</span>
            <span className="macro-px">{idx.px}</span>
            <span className={`macro-pct ${idx.pos ? 'pos' : 'neg'}`}>
              {idx.pos ? `[▲ ${idx.pct}]` : `[▼ ${idx.pct}]`}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Bloomberg 4-Quadrant Terminal Layout */}
      <div className="terminal-grid-4quad">
        {/* Quadrant 1: Chart & Live Ticker Telemetry */}
        <div className="terminal-panel chart-quadrant">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;GP&gt;</span>
              <span className="panel-title">{selectedSymbol} GRAPH &amp; VOL ANALYSIS</span>
            </div>
            <div className="timeframe-selector">
              {(['1D', '5D', '1M', '1Y', '5Y'] as const).map((tf) => (
                <button
                  key={tf}
                  className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  [{tf}]
                </button>
              ))}
            </div>
          </div>

          <div className="chart-telemetry-header">
            <div className="telem-block">
              <span className="telem-lbl">LAST PRICE</span>
              <span className="telem-val-large pos">₹2,985.50</span>
              <span className="telem-chg pos">+32.10 (+1.09%)</span>
            </div>
            <div className="telem-block">
              <span className="telem-lbl">OPEN</span>
              <span className="telem-val">₹2,958.00</span>
            </div>
            <div className="telem-block">
              <span className="telem-lbl">DAY HIGH</span>
              <span className="telem-val pos">₹2,994.80</span>
            </div>
            <div className="telem-block">
              <span className="telem-lbl">DAY LOW</span>
              <span className="telem-val neg">₹2,952.10</span>
            </div>
            <div className="telem-block">
              <span className="telem-lbl">VWAP</span>
              <span className="telem-val">₹2,978.40</span>
            </div>
            <div className="telem-block">
              <span className="telem-lbl">VOLUME</span>
              <span className="telem-val">6.42M</span>
            </div>
          </div>

          {/* SVG Price Chart Graphic */}
          <div className="terminal-svg-chart-container">
            <svg viewBox="0 0 700 220" className="terminal-chart-svg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ff66" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00ff66" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#152238" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#152238" strokeDasharray="3,3" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#152238" strokeDasharray="3,3" />
              <line x1="0" y1="190" x2="700" y2="190" stroke="#152238" strokeDasharray="3,3" />

              {/* Volume Bars */}
              <rect x="30" y="180" width="12" height="20" fill="#00ff66" opacity="0.3" />
              <rect x="70" y="170" width="12" height="30" fill="#00ff66" opacity="0.3" />
              <rect x="110" y="160" width="12" height="40" fill="#ff3344" opacity="0.3" />
              <rect x="150" y="175" width="12" height="25" fill="#00ff66" opacity="0.3" />
              <rect x="190" y="150" width="12" height="50" fill="#00ff66" opacity="0.3" />
              <rect x="230" y="140" width="12" height="60" fill="#00ff66" opacity="0.3" />
              <rect x="270" y="165" width="12" height="35" fill="#ff3344" opacity="0.3" />
              <rect x="310" y="155" width="12" height="45" fill="#00ff66" opacity="0.3" />
              <rect x="350" y="130" width="12" height="70" fill="#00ff66" opacity="0.3" />
              <rect x="390" y="145" width="12" height="55" fill="#ff3344" opacity="0.3" />
              <rect x="430" y="125" width="12" height="75" fill="#00ff66" opacity="0.3" />
              <rect x="470" y="135" width="12" height="65" fill="#00ff66" opacity="0.3" />
              <rect x="510" y="120" width="12" height="80" fill="#00ff66" opacity="0.3" />
              <rect x="550" y="110" width="12" height="90" fill="#00ff66" opacity="0.3" />
              <rect x="590" y="105" width="12" height="95" fill="#00ff66" opacity="0.3" />
              <rect x="630" y="95" width="12" height="105" fill="#00ff66" opacity="0.3" />

              {/* Area Gradient */}
              <polygon
                points="0,200 0,160 50,155 100,165 150,140 200,145 250,120 300,130 350,95 400,105 450,80 500,75 550,55 600,60 650,40 700,45 700,200"
                fill="url(#chartGrad)"
              />

              {/* Price Line */}
              <polyline
                points="0,160 50,155 100,165 150,140 200,145 250,120 300,130 350,95 400,105 450,80 500,75 550,55 600,60 650,40 700,45"
                fill="none"
                stroke="#00ff66"
                strokeWidth="2.5"
              />

              {/* VWAP Dashed Line */}
              <line x1="0" y1="95" x2="700" y2="70" stroke="#ffaa00" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* High / Low Points */}
              <circle cx="650" cy="40" r="4" fill="#00ff66" stroke="#000" strokeWidth="1.5" />
              <text x="615" y="32" fill="#00ff66" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                H: 2,994.80
              </text>
            </svg>
          </div>
        </div>

        {/* Quadrant 2: Level-2 Order Book / Market Depth */}
        <div className="terminal-panel orderbook-quadrant">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;L2&gt;</span>
              <span className="panel-title">MARKET DEPTH &amp; LEVEL-2 ORDER BOOK</span>
            </div>
            <span className="spread-tag">SPREAD: ₹0.30 (0.01%)</span>
          </div>

          <div className="orderbook-grid">
            {/* Bid Side (Buyers - Green) */}
            <div className="ob-side">
              <div className="ob-side-header pos">[BID / BUY DEPTH]</div>
              <table className="ob-table">
                <thead>
                  <tr>
                    <th>BID PX</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBookBids.map((b, i) => (
                    <tr key={i} className="ob-row">
                      <td className="ob-px pos">{b.px}</td>
                      <td>{b.qty}</td>
                      <td>
                        <div className="depth-bar-wrapper">
                          <div className="depth-bar bid" style={{ width: `${b.depthPct}%` }}></div>
                          <span className="depth-num">{b.total}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ask Side (Sellers - Red) */}
            <div className="ob-side">
              <div className="ob-side-header neg">[ASK / SELL DEPTH]</div>
              <table className="ob-table">
                <thead>
                  <tr>
                    <th>ASK PX</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBookAsks.map((a, i) => (
                    <tr key={i} className="ob-row">
                      <td className="ob-px neg">{a.px}</td>
                      <td>{a.qty}</td>
                      <td>
                        <div className="depth-bar-wrapper">
                          <div className="depth-bar ask" style={{ width: `${a.depthPct}%` }}></div>
                          <span className="depth-num">{a.total}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quadrant 3: Heavyweight Securities Monitor */}
        <div className="terminal-panel securities-quadrant">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;SEC&gt;</span>
              <span className="panel-title">NIFTY HEAVYWEIGHT SECURITIES MONITOR</span>
            </div>
            <span className="source-tag">SOURCE: NSE / YAHOO</span>
          </div>

          <div className="terminal-table-container">
            <table className="terminal-data-table">
              <thead>
                <tr>
                  <th>TICKER</th>
                  <th>SECURITY NAME</th>
                  <th className="num">LAST PX</th>
                  <th className="num">NET CHG</th>
                  <th className="num">% CHG</th>
                  <th className="num">BID</th>
                  <th className="num">ASK</th>
                  <th className="num">VOL (M)</th>
                  <th className="num">P/E</th>
                  <th>52W RANGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((w) => (
                  <tr
                    key={w.symbol}
                    className={`term-row ${selectedSymbol === w.symbol ? 'selected' : ''}`}
                    onClick={() => setSelectedSymbol(w.symbol)}
                  >
                    <td className="ticker-cell">
                      <strong>{w.symbol}</strong>
                    </td>
                    <td className="name-cell">{w.name}</td>
                    <td className="num bold">{w.last}</td>
                    <td className={`num ${w.pos ? 'pos' : 'neg'}`}>{w.chg}</td>
                    <td className={`num ${w.pos ? 'pos' : 'neg'} bold`}>
                      {w.pos ? `[+${w.pct}]` : `[${w.pct}]`}
                    </td>
                    <td className="num">{w.bid}</td>
                    <td className="num">{w.ask}</td>
                    <td className="num">{w.vol}</td>
                    <td className="num">{w.pe}x</td>
                    <td>
                      <div className="spark-range">
                        <div className="spark-fill" style={{ width: `${w.range52}%` }}></div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-term-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSymbol(w.symbol);
                        }}
                      >
                        &lt;LOAD&gt;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quadrant 4: Institutional News Wire */}
        <div className="terminal-panel wire-quadrant">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="panel-code">&lt;NEWS&gt;</span>
              <span className="panel-title">INSTITUTIONAL NEWS WIRE STREAM</span>
            </div>
            <span className="wire-live-tag">[WIRE ACTIVE]</span>
          </div>

          <div className="wire-feed-list">
            {newsWire.map((item, idx) => (
              <div key={idx} className="wire-card">
                <div className="wire-meta-row">
                  <span className="wire-time">[{item.time}]</span>
                  <span className="wire-ticker">&lt;{item.ticker}&gt;</span>
                  <span className="wire-tag">[{item.tag}]</span>
                  <span className={`wire-sentiment ${item.sentiment.toLowerCase()}`}>
                    [{item.sentiment}]
                  </span>
                </div>
                <div className="wire-headline">{item.headline}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
