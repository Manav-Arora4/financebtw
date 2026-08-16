import React, { useState, useRef, useEffect } from 'react';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  children: React.ReactElement;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  delay = 400,
  children,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => () => { if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current); }, []);

  return (
    <span className="fs-tooltip-wrapper" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && content && (
        <span className={`fs-tooltip fs-tooltip--${placement}`} role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
};
