import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { CompanySelector } from '../components/dashboard/CompanySelector';
import { TrackedCompaniesBar } from '../components/dashboard/TrackedCompaniesBar';
import { AssetHeader } from '../components/dashboard/AssetHeader';
import { CandlestickChart } from '../components/dashboard/CandlestickChart';
import { KeyMetricsCard } from '../components/dashboard/KeyMetricsCard';
import { FinancialsCard } from '../components/dashboard/FinancialsCard';
import { AnalystRatingsCard } from '../components/dashboard/AnalystRatingsCard';
import { MarketMoversCard } from '../components/dashboard/MarketMoversCard';
import { LatestNewsCard } from '../components/dashboard/LatestNewsCard';
import { UpcomingEventsCard } from '../components/dashboard/UpcomingEventsCard';
import { PortfolioSummaryCard } from '../components/dashboard/PortfolioSummaryCard';

export const MarketPage: React.FC = () => {
  const { activeNavTab, setActiveNavTab, selectedSymbol, setSelectedSymbol } = useAppStore();

  const watchlistItems = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', price: '₹1,322.00', chg: '+0.46%', mcap: '₹17.8L Cr', pe: '23.8', vol: '9.95M', pos: true },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: '₹2,280.00', chg: '-1.44%', mcap: '₹15.1L Cr', pe: '16.6', vol: '2.18M', pos: false },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', price: '₹723.00', chg: '-0.82%', mcap: '₹12.5L Cr', pe: '15.8', vol: '8.95M', pos: false },
    { symbol: 'INFY.NS', name: 'Infosys Limited', price: '₹1,115.00', chg: '-2.18%', mcap: '₹7.8L Cr', pe: '14.8', vol: '5.62M', pos: false },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', price: '₹1,412.00', chg: '-0.23%', mcap: '₹8.3L Cr', pe: '17.4', vol: '7.12M', pos: false },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd', price: '₹1,934.20', chg: '-1.78%', mcap: '₹8.6L Cr', pe: '42.1', vol: '4.85M', pos: false },
    { symbol: 'SBIN.NS', name: 'State Bank of India', price: '₹812.50', chg: '+0.65%', mcap: '₹7.2L Cr', pe: '10.2', vol: '14.2M', pos: true },
    { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd', price: '₹3,620.00', chg: '+1.10%', mcap: '₹4.9L Cr', pe: '33.5', vol: '1.75M', pos: true },
  ];

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveNavTab('Dashboard');
  };

  // 1. Dedicated Watchlist View
  if (activeNavTab === 'Watchlist') {
    return (
      <div className="financebtw-market-dashboard">
        <div className="subview-header-bar">
          <div>
            <h2 className="subview-heading">Indian Equities Watchlist</h2>
            <p className="subview-sub">Track real-time quotes, valuations, and trading volumes across Nifty heavyweights</p>
          </div>
          <button className="btn-orange-primary" onClick={() => setActiveNavTab('Dashboard')}>
            &lt; Back to Dashboard
          </button>
        </div>

        <div className="financebtw-card">
          <table className="terminal-table-full">
            <thead>
              <tr>
                <th>Security / Symbol</th>
                <th className="num">Last Price</th>
                <th className="num">% Change</th>
                <th className="num">Market Cap</th>
                <th className="num">P/E Ratio</th>
                <th className="num">Volume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlistItems.map((item) => (
                <tr key={item.symbol} className="term-row" onClick={() => handleSelectStock(item.symbol)}>
                  <td className="ticker-cell">
                    <strong>{item.symbol.replace('.NS', '')}</strong>
                    <div className="holding-sub-name">{item.name}</div>
                  </td>
                  <td className="num bold">{item.price}</td>
                  <td className={`num bold ${item.pos ? 'pos' : 'neg'}`}>{item.chg}</td>
                  <td className="num">{item.mcap}</td>
                  <td className="num">{item.pe}</td>
                  <td className="num">{item.vol}</td>
                  <td>
                    <button className="btn-term-action" onClick={(e) => { e.stopPropagation(); handleSelectStock(item.symbol); }}>
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. Dedicated Heatmap View
  if (activeNavTab === 'Heatmap') {
    const sectors = [
      { name: 'Financials & Banking (34%)', stocks: [{ s: 'HDFCBANK', c: '-0.82%', pos: false, w: 'large' }, { s: 'ICICIBANK', c: '-0.23%', pos: false, w: 'medium' }, { s: 'SBIN', c: '+0.65%', pos: true, w: 'medium' }, { s: 'KOTAKBANK', c: '-0.25%', pos: false, w: 'small' }] },
      { name: 'IT Services (16%)', stocks: [{ s: 'TCS', c: '-1.44%', pos: false, w: 'large' }, { s: 'INFY', c: '-2.18%', pos: false, w: 'large' }, { s: 'HCLTECH', c: '-0.75%', pos: false, w: 'small' }, { s: 'WIPRO', c: '+0.40%', pos: true, w: 'small' }] },
      { name: 'Energy & Oil (14%)', stocks: [{ s: 'RELIANCE', c: '+0.46%', pos: true, w: 'large' }, { s: 'ONGC', c: '+1.40%', pos: true, w: 'medium' }, { s: 'NTPC', c: '+0.30%', pos: true, w: 'small' }] },
      { name: 'Auto & Industrials (12%)', stocks: [{ s: 'LT', c: '+1.10%', pos: true, w: 'medium' }, { s: 'TATAMOTORS', c: '+1.75%', pos: true, w: 'medium' }, { s: 'BHARTIARTL', c: '-1.78%', pos: false, w: 'small' }] },
    ];

    return (
      <div className="financebtw-market-dashboard">
        <div className="subview-header-bar">
          <div>
            <h2 className="subview-heading">Nifty 50 Sector Heatmap</h2>
            <p className="subview-sub">Visual performance breakdown weighted by Indian market capitalization</p>
          </div>
          <button className="btn-orange-primary" onClick={() => setActiveNavTab('Dashboard')}>
            &lt; Back to Dashboard
          </button>
        </div>

        <div className="heatmap-grid-container">
          {sectors.map((sec) => (
            <div key={sec.name} className="heatmap-sector-block">
              <div className="heatmap-sec-title">{sec.name}</div>
              <div className="heatmap-stocks-flex">
                {sec.stocks.map((stk) => (
                  <div
                    key={stk.s}
                    className={`heatmap-stock-tile ${stk.w} ${stk.pos ? 'pos' : 'neg'}`}
                    onClick={() => handleSelectStock(`${stk.s}.NS`)}
                  >
                    <span className="tile-sym">{stk.s}</span>
                    <span className="tile-chg">{stk.c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no security selected, show empty launcher view
  if (!selectedSymbol) {
    return (
      <div className="financebtw-market-dashboard">
        <CompanySelector />
      </div>
    );
  }

  // Active Company Telemetry Dashboard View
  return (
    <div className="financebtw-market-dashboard">
      {/* 0. Tracked Companies Toolbar */}
      <TrackedCompaniesBar />

      {/* 1. Active Security Header & Fundamentals Row */}
      <AssetHeader />

      {/* 2. Full Interactive Candlestick Chart Panel */}
      <CandlestickChart />

      {/* 3. Middle Data Grid (3 Columns: Key Metrics | Financials TTM | Analyst Ratings) */}
      <div className="dashboard-grid-3col">
        <KeyMetricsCard />
        <FinancialsCard />
        <AnalystRatingsCard />
      </div>

      {/* 4. Bottom Data Grid (4 Columns: Market Movers | Latest News | Upcoming Events | My Portfolio) */}
      <div className="dashboard-grid-4col">
        <MarketMoversCard />
        <LatestNewsCard />
        <UpcomingEventsCard />
        <PortfolioSummaryCard />
      </div>
    </div>
  );
};

export default MarketPage;
