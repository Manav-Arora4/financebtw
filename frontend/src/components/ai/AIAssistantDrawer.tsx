import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  IconSparkles,
  IconThumbsUp,
  IconThumbsDown,
  IconCopy,
  IconPaperclip,
  IconSend,
} from '../icons/Icons';

export const AIAssistantDrawer: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const isApple = selectedSymbol.includes('AAPL') || !selectedSymbol.includes('.NS');
  const entityName = isApple ? 'Apple Inc.' : 'Reliance Industries Ltd.';

  const promptChips = [
    'Analyze valuation',
    'Compare to Microsoft',
    'Show risk factors',
    'Generate DCF model',
    'What are the key risks?',
    'Explain revenue by segment',
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <button
        className="btn-ai-floating-reopen"
        onClick={() => setIsOpen(true)}
        title="Open AI Assistant"
      >
        <IconSparkles size={16} />
        <span>AI Assistant</span>
      </button>
    );
  }

  return (
    <aside className="ai-assistant-docked-panel">
      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-title-group">
          <IconSparkles size={16} className="sparkle-symbol" />
          <span className="ai-panel-heading">AI Assistant</span>
        </div>
        <div className="ai-header-controls">
          <button className="btn-ai-new-chat">
            New Chat
          </button>
          <button
            className="btn-ai-close-panel"
            onClick={() => setIsOpen(false)}
            title="Collapse AI Assistant"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="ai-messages-scroll-area">
        {/* Sample / First User Query */}
        <div className="user-chat-bubble">
          <span>Summarize Apple's Q1 earnings and key takeaways.</span>
        </div>

        {/* Structured Earnings Summary Card */}
        <div className="ai-response-summary-card">
          <h4 className="summary-company-title">
            {entityName} Q1 FY2024 Earnings Summary
          </h4>

          <ul className="summary-bullets-list">
            <li>
              <strong>Revenue:</strong> $119.6B, +2.1% YoY (beat est. $117.9B)
            </li>
            <li>
              <strong>EPS:</strong> $2.18, +16.0% YoY (beat est. $2.10)
            </li>
            <li>
              <strong>Services revenue:</strong> hit record $23.1B, +11% YoY
            </li>
            <li>
              <strong>iPhone revenue:</strong> $69.7B, -1% YoY
            </li>
            <li>
              <strong>Gross margin:</strong> 45.9%, up 1.2pp YoY
            </li>
            <li>
              Strong performance in Wearables and Services
            </li>
          </ul>

          <div className="summary-section-divider"></div>

          <h5 className="takeaways-heading">Key Takeaways</h5>
          <ol className="takeaways-numbered-list">
            <li>Services growth remains a key strength.</li>
            <li>iPhone demand stabilized better than expected.</li>
            <li>Margin expansion shows operational leverage.</li>
            <li>China recovery still a watch point.</li>
            <li>Strong balance sheet with $62B cash.</li>
          </ol>

          {/* Sources Badges */}
          <div className="sources-row-group">
            <span className="sources-label">Sources (5)</span>
            <div className="sources-badges-flex">
              <span className="source-pill">Apple IR</span>
              <span className="source-pill">Seeking Alpha</span>
              <span className="source-pill">Bloomberg</span>
              <span className="source-pill">CNBC</span>
              <span className="source-pill">Reuters</span>
            </div>
          </div>

          {/* Feedback Icons */}
          <div className="feedback-actions-row">
            <button className="btn-feedback" title="Helpful">
              <IconThumbsUp size={13} />
            </button>
            <button className="btn-feedback" title="Not Helpful">
              <IconThumbsDown size={13} />
            </button>
            <button className="btn-feedback" onClick={handleCopy} title="Copy Text">
              <IconCopy size={13} />
              {copied && <span style={{ fontSize: 10, marginLeft: 4 }}>Copied!</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips (2x3 Grid) */}
      <div className="ai-prompt-chips-grid">
        {promptChips.map((prompt) => (
          <button
            key={prompt}
            className="btn-prompt-chip"
            onClick={() => {}}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        className="ai-chat-input-bar"
        onSubmit={(e) => e.preventDefault()}
      >
        <button type="button" className="btn-attach" title="Attach Document">
          <IconPaperclip size={16} />
        </button>
        <input
          type="text"
          className="ai-input-text"
          placeholder="Ask anything about markets, companies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-ai-submit" disabled={!input.trim()}>
          <IconSend size={13} />
        </button>
      </form>
      <div className="ai-disclaimer-text">
        AI can make mistakes. Verify important info.
      </div>
    </aside>
  );
};
