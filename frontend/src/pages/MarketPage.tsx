import React from 'react';
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
  return (
    <div className="finsight-market-dashboard">
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
