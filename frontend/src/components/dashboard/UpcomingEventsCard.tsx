import React from 'react';

export const UpcomingEventsCard: React.FC = () => {
  const events = [
    {
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      ),
      title: 'Earnings Call',
      subtitle: 'Q1 FY2025',
      date: 'May 2, 2026 5:00 PM',
    },
    {
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      ),
      title: 'Annual General Meeting',
      subtitle: 'June 10, 2026',
      date: '',
    },
    {
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      ),
      title: 'Dividend Payment',
      subtitle: '₹10.00 per share',
      date: 'May 16, 2026',
    },
  ];

  return (
    <div className="financebtw-card upcoming-events-card">
      <div className="card-top-title-row">
        <h3 className="card-main-heading">Upcoming Events</h3>
      </div>

      <div className="events-timeline-container">
        {events.map((ev, i) => (
          <div key={i} className="event-timeline-item">
            <div className="timeline-glyph-column">
              <div className="event-icon-circle-sm">
                {ev.icon}
              </div>
              {i < events.length - 1 && <div className="timeline-vertical-connector"></div>}
            </div>
            <div className="event-details-col">
              <div className="event-title-main">{ev.title}</div>
              <div className="event-subtitle-text">{ev.subtitle}</div>
              {ev.date && <div className="event-date-text">{ev.date}</div>}
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
