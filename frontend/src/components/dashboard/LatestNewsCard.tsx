import React from 'react';

export const LatestNewsCard: React.FC = () => {
  const newsItems = [
    {
      sourceIcon: '[B]',
      headline: 'Apple reports Q1 earnings beat, services revenue hits record high',
      source: 'Institutional Wire',
      timeAgo: '2h ago',
    },
    {
      sourceIcon: '[C]',
      headline: 'Vision Pro 2 enterprise adoption expected in late 2025: Report',
      source: 'Tech Wire',
      timeAgo: '5h ago',
    },
    {
      sourceIcon: '[R]',
      headline: 'Apple expands AI partnership, integrates new features across ecosystem',
      source: 'Global News',
      timeAgo: '1d ago',
    },
  ];

  return (
    <div className="finsight-card latest-news-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Latest News</h3>
      </div>

      <div className="news-items-container">
        {newsItems.map((n, i) => (
          <div key={i} className="news-article-row">
            <div className="news-source-logo-box">
              <span>{n.sourceIcon}</span>
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
