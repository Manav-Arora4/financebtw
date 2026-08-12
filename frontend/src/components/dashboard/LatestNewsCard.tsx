import React from 'react';

export const LatestNewsCard: React.FC = () => {
  const newsItems = [
    {
      sourceIcon: (
        <span className="news-brand-badge bloomberg">B</span>
      ),
      headline: 'Apple reports Q1 earnings beat, services revenue hits record high',
      source: 'Bloomberg',
      timeAgo: '2h ago',
    },
    {
      sourceIcon: (
        <span className="news-brand-badge cnbc">CNBC</span>
      ),
      headline: 'Apple Vision Pro 2 expected in late 2025: Report',
      source: 'CNBC',
      timeAgo: '5h ago',
    },
    {
      sourceIcon: (
        <span className="news-brand-badge reuters">R</span>
      ),
      headline: 'Apple expands enterprise partnership, integrates new features across ecosystem',
      source: 'Reuters',
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
            <div className="news-source-logo-wrapper">
              {n.sourceIcon}
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
