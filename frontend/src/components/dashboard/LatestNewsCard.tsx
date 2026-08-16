import React from 'react';

export const LatestNewsCard: React.FC = () => {
  const indianNews = [
    {
      badge: <span className="news-brand-badge et">ET</span>,
      headline: 'Reliance Retail expands fashion & lifestyle footprint with multi-brand stores',
      source: 'Economic Times',
      timeAgo: '2h ago',
    },
    {
      badge: <span className="news-brand-badge mint">MINT</span>,
      headline: 'Jio Financial Services receives regulatory approvals for asset management JV',
      source: 'LiveMint',
      timeAgo: '4h ago',
    },
    {
      badge: <span className="news-brand-badge mc">MC</span>,
      headline: 'RIL 5G subscriber base crosses 130M; ARPU expands to ₹181.7',
      source: 'Moneycontrol',
      timeAgo: '1d ago',
    },
  ];

  return (
    <div className="financebtw-card latest-news-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Latest News</h3>
      </div>

      <div className="news-items-container">
        {indianNews.map((n, i) => (
          <div key={i} className="news-article-row">
            <div className="news-source-logo-wrapper">
              {n.badge}
            </div>
            <div className="news-content-col">
              <h4 className="news-headline-text">{n.headline}</h4>
              <div className="news-meta-line">
                <span className="news-source-name">{n.source}</span>
                <span className="news-meta-dot">•</span>
                <span className="news-time-ago">{n.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View all news &gt;</button>
      </div>
    </div>
  );
};
