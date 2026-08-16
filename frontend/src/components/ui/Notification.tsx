import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Notification.css';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type?: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

const ICONS: Record<NotificationType, React.ReactNode> = {
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  success: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  error: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const type = notification.type ?? 'info';

  useEffect(() => {
    const duration = notification.duration ?? 4000;
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <div className={['fs-toast', `fs-toast--${type}`, exiting ? 'fs-toast--exit' : ''].filter(Boolean).join(' ')}>
      <span className="fs-toast__icon">{ICONS[type]}</span>
      <div className="fs-toast__body">
        <span className="fs-toast__title">{notification.title}</span>
        {notification.message && <span className="fs-toast__msg">{notification.message}</span>}
      </div>
      <button className="fs-toast__close" onClick={() => onDismiss(notification.id)} aria-label="Dismiss">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
};

/* ── Notification Manager (singleton) ──────────────────── */
type Listener = (notifications: Notification[]) => void;
let _notifications: Notification[] = [];
const _listeners: Set<Listener> = new Set();

function notify(listeners: Set<Listener>, notifications: Notification[]) {
  listeners.forEach((l) => l([...notifications]));
}

export const notificationManager = {
  add(n: Omit<Notification, 'id'>) {
    const item = { ...n, id: Math.random().toString(36).slice(2, 9) };
    _notifications = [item, ..._notifications].slice(0, 5);
    notify(_listeners, _notifications);
  },
  remove(id: string) {
    _notifications = _notifications.filter((n) => n.id !== id);
    notify(_listeners, _notifications);
  },
  subscribe(listener: Listener) {
    _listeners.add(listener);
    return () => _listeners.delete(listener);
  },
};

export const NotificationStack: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    const unsub = notificationManager.subscribe(setItems);
    return () => { unsub(); };
  }, []);

  if (items.length === 0) return null;

  return createPortal(
    <div className="fs-toast-stack">
      {items.map((n) => (
        <Toast key={n.id} notification={n} onDismiss={notificationManager.remove} />
      ))}
    </div>,
    document.body
  );
};
