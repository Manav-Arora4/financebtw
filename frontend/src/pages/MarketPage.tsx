import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const MarketPage: React.FC = () => {
  const { selectedSymbol, setSelectedSymbol } = useAppStore();
  const [searchInput, setSearchInput] = useState('');

  const majorIndices = [
    { name: 'NIFTY 50', symbol: '^NSEI', value: '24,350.25', change: '+185.40', percent: '+0.77%', status: 'positive' },
    { name: 'BANK NIFTY', symbol: '^NSEBANK', value: '51,240.80', change: '+410.20', percent: '+0.81%', status: 'positive' },
    { name: 'BSE SENSEX', symbol: '^BSESN', value: '80,120.45', change: '+590.10', percent: '+0.74%', status: 'positive' },
    { name: 'NIFTY IT', symbol: '^CNXIT', value: '41,890.30', change: '-120.50', percent: '-0.29%', status: 'negative' },
  ];

  const watchlist = [
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: '₹2,985.50', change: '+1.09%', pe: '28.4', cap: '₹20.2L Cr' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: '₹4,190.00', change: '-0.37%', pe: '31.2', cap: '₹15.1L Cr' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', price: '₹1,645.20', change: '+0.78%', pe: '19.5', cap: '₹12.5L Cr' },
    { symbol: 'INFY.NS', name: 'Infosys Limited', price: '₹1,875.40', change: '+1.31%', pe: '29.1', cap: '₹7.8L Cr' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', price: '₹1,180.90', change: '+1.15%', pe: '17.8', cap: '₹8.3L Cr' },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', price: '₹1,490.25', change: '+0.45%', pe: '42.1', cap: '₹8.9L Cr' },
  ];

  const newsHeadlines = [
    {
      title: 'RBI Monetary Policy Committee maintains benchmark repo rate at 6.5%',
      source: 'TheNewsAPI / Economic Times',
      time: '18 mins ago',
      category: 'Monetary Policy',
    },
    {
      title: 'Reliance Retail expands strategic joint venture for global fashion brands',
      source: 'TheNewsAPI / LiveMint',
      time: '45 mins ago',
      category: 'Corporate Action',
    },
    {
      title: 'FIIs turn net buyers in Indian equities with ₹2,450 Cr inflow in cash segment',
      source: 'TheNewsAPI / Business Standard',
      time: '2 hours ago',
      category: 'Institutional Flows',
    },
    {
      title: 'IT Sector Q3 preview: Tier-1 Indian tech majors anticipate BFSI deal recovery',
      source: 'TheNewsAPI / Financial Express',
      time: '3 hours ago',
      category: 'Sector Analysis',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">[Market Intelligence &amp; Live Feeds]</h2>
          <p className="page-subtitle">Real-time Indian &amp; Global Exchange Feeds, Valuation Ratios, and Curated News</p>
        </div>
        <div className="search-box-inline">
          <input
            type="text"
            className="form-input"
            style={{ width: '260px' }}
            placeholder="Search stock (e.g. TATAMOTORS.NS)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchInput.trim()) {
                setSelectedSymbol(searchInput.toUpperCase().trim());
                setSearchInput('');
              }
            }}
          />
        </div>
      </div>

      {/* Major Indices Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {majorIndices.map((idx) => (
          <div key={idx.symbol} className="card glass">
            <div className="card-header">
              <span className="stat-label">{idx.name}</span>
              <span className={`badge ${idx.status === 'positive' ? 'badge-success' : 'badge-danger'}`}>
                [{idx.percent}]
              </span>
            </div>
            <div className="stat-val" style={{ fontSize: '1.4rem', marginTop: '0.5rem' }}>
              {idx.value}
            </div>
            <div className="text-muted" style={{ marginTop: '0.25rem' }}>
              Change: {idx.change} pts
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Market Watchlist Table */}
        <div className="card glass">
          <div className="card-header">
            <h3 className="card-title">Nifty Heavyweights Universe</h3>
            <span className="badge badge-info">Yahoo Finance / NSE</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>P/E</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => (
                  <tr
                    key={item.symbol}
                    className={selectedSymbol === item.symbol ? 'selected-row' : ''}
                  >
                    <td>
                      <strong>{item.symbol}</strong>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{item.name}</div>
                    </td>
                    <td>{item.price}</td>
                    <td>
                      <span className={item.change.startsWith('+') ? 'text-positive' : 'text-negative'}>
                        [{item.change}]
                      </span>
                    </td>
                    <td>{item.pe}x</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedSymbol(item.symbol)}
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live News Feed */}
        <div className="card glass">
          <div className="card-header">
            <h3 className="card-title">Curated Financial News Stream</h3>
            <span className="badge badge-info">[TheNewsAPI: Active]</span>
          </div>
          <div className="news-feed-list">
            {newsHeadlines.map((news, i) => (
              <div key={i} className="news-feed-item">
                <div className="news-feed-category">[{news.category}]</div>
                <h4 className="news-feed-title">{news.title}</h4>
                <div className="news-feed-meta">
                  <span>{news.source}</span>
                  <span>*</span>
                  <span>{news.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
