import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import apiClient from '../../api/client';

interface NewsArticle {
  title: string;
  description?: string;
  url?: string;
  source: string;
  published_at: string;
}

export const LatestNewsCard: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSymbol) return;
    let isMounted = true;
    setLoading(true);

    apiClient
      .get<NewsArticle[]>(`/api/v1/market/news?query=${selectedSymbol}&limit=5`)
      .then((res) => {
        if (isMounted && res.data) {
          setArticles(res.data);
        }
      })
      .catch(() => {
        if (isMounted) setArticles([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSymbol]);

  if (!selectedSymbol) return null;
  const clean = selectedSymbol.replace('.NS', '').replace('.BO', '');

  return (
    <div className="financebtw-card latest-news-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Real-Time News</h3>
        <span className="card-sub-badge">Live Feed</span>
      </div>

      {loading ? (
        <div className="card-loading-state">
          <div className="card-loading-spinner" />
          <span>Searching latest verified news for {clean}...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="card-notice-empty">
          <span className="notice-icon">📰</span>
          <span>No recent news articles reported for {clean}.</span>
        </div>
      ) : (
        <div className="news-items-container">
          {articles.map((n, i) => {
            const timeFormatted = n.published_at ? new Date(n.published_at).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }) : 'Recent';

            return (
              <a
                key={i}
                href={n.url || '#'}
                target={n.url ? '_blank' : '_self'}
                rel="noreferrer noopener"
                className="news-article-row clickable"
              >
                <div className="news-content-col">
                  <h4 className="news-headline-text">{n.title}</h4>
                  <div className="news-meta-line">
                    <span className="news-source-name">{n.source}</span>
                    <span className="news-meta-dot">•</span>
                    <span className="news-time-ago">{timeFormatted}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
