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

  const tickerClean = selectedSymbol ? selectedSymbol.replace('.NS', '').replace('.BO', '') : 'NIFTY';
  const entityName = tickerClean === 'TCS' ? 'Tata Consultancy Services' :
                     tickerClean === 'INFY' ? 'Infosys Limited' :
                     tickerClean === 'HDFCBANK' ? 'HDFC Bank Ltd.' :
                     tickerClean === 'RELIANCE' ? 'Reliance Industries Ltd.' :
                     'Indian Markets Benchmark';

  const promptChips = [
    'Analyze valuation',
    'Compare to peers',
    'Show risk factors',
    'Generate DCF model',
    'What are key risks?',
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
          <span>Summarize {entityName}'s Q1 earnings and key takeaways.</span>
        </div>

        {/* Structured Earnings Summary Card */}
        <div className="ai-response-summary-card">
          <h4 className="summary-company-title">
            {entityName} Q1 FY2025 Earnings Summary
          </h4>

          <ul className="summary-bullets-list">
            <li>
              <strong>Revenue:</strong> ₹10.04L Cr, +8.2% YoY (beat est. ₹9.85L Cr)
            </li>
            <li>
              <strong>EPS:</strong> ₹105.10, +7.1% YoY (beat consensus estimates)
            </li>
            <li>
              <strong>Digital &amp; Retail revenue:</strong> hit record +11.2% YoY
            </li>
            <li>
              <strong>Jio ARPU:</strong> ₹181.7 / month, expanding operating leverage
            </li>
            <li>
              <strong>Gross margin:</strong> 34.9%, up 1.2pp YoY with operational efficiency
            </li>
            <li>
              Strong free cash flow generation of ₹48,200 Cr
            </li>
          </ul>

          <div className="summary-section-divider"></div>

          <h5 className="takeaways-heading">Key Takeaways</h5>
          <ol className="takeaways-numbered-list">
            <li>Digital and retail segments remain primary growth engines.</li>
            <li>Consumer demand stabilized significantly better than expected.</li>
            <li>Margin expansion shows operational leverage across business verticals.</li>
            <li>New energy business rollout on track for second half.</li>
            <li>Strong balance sheet with robust cash conversion.</li>
          </ol>

          {/* Sources Badges */}
          <div className="sources-row-group">
            <span className="sources-label">Sources (5)</span>
            <div className="sources-badges-flex">
              <span className="source-pill">NSE Filings</span>
              <span className="source-pill">Company IR</span>
              <span className="source-pill">Economic Times</span>
              <span className="source-pill">LiveMint</span>
              <span className="source-pill">Moneycontrol</span>
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
