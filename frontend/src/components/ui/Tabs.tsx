import React, { useState, useEffect, useRef } from 'react';
import './Tabs.css';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (id: string) => void;
  variant?: 'line' | 'pill' | 'chip';
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  size = 'sm',
  className = '',
}) => {
  const [active, setActive] = useState(activeTab ?? tabs[0]?.id);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== undefined) setActive(activeTab);
  }, [activeTab]);

  // Animate indicator for line variant
  useEffect(() => {
    if (variant !== 'line' || !listRef.current || !indicatorRef.current) return;
    const activeBtn = listRef.current.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (!activeBtn) return;
    const indicator = indicatorRef.current;
    indicator.style.width = `${activeBtn.offsetWidth}px`;
    indicator.style.left = `${activeBtn.offsetLeft}px`;
  }, [active, variant]);

  const handleClick = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  return (
    <div className={['fs-tabs', `fs-tabs--${variant}`, `fs-tabs--${size}`, className].filter(Boolean).join(' ')}>
      <div ref={listRef} className="fs-tabs__list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            data-active={active === tab.id}
            disabled={tab.disabled}
            className={['fs-tabs__tab', active === tab.id ? 'fs-tabs__tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => !tab.disabled && handleClick(tab.id)}
          >
            {tab.icon && <span className="fs-tabs__tab-icon">{tab.icon}</span>}
            <span className="fs-tabs__tab-label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="fs-tabs__tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
        {variant === 'line' && <span ref={indicatorRef} className="fs-tabs__indicator" />}
      </div>
    </div>
  );
};
