import React from 'react';

export const UpcomingEventsCard: React.FC = () => {
  const events = [
    {
      icon: '[#]',
      title: 'Earnings Call',
      subtitle: 'Q2 FY2024',
      date: 'May 2, 2026 5:00 PM',
    },
    {
      icon: '[*]',
      title: 'WWDC / AGM 2026',
      subtitle: 'Product Keynote',
      date: 'June 10, 2026',
    },
    {
      icon: '[$]',
      title: 'Dividend Payment',
      subtitle: '$0.24 per share',
      date: 'May 16, 2026',
    },
  ];

  return (
    <div className="finsight-card upcoming-events-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Upcoming Events</h3>
      </div>

      <div className="events-items-list">
        {events.map((ev, i) => (
          <div key={i} className="event-item-row">
            <div className="event-icon-circle">
              <span>{ev.icon}</span>
            </div>
            <div className="event-details-col">
              <div className="event-title-main">{ev.title}</div>
              <div className="event-subtitle-text">{ev.subtitle}</div>
              <div className="event-date-text">{ev.date}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer-link">
        <button className="btn-link-action">View calendar &gt;</button>
      </div>
    </div>
  );
};
