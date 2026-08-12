import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

export const AIAssistantDrawer: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text?: string }>>([
    {
      sender: 'user',
      text: `Summarize ${selectedSymbol}'s Q1 earnings and key takeaways.`,
    },
  ]);

  const promptChips = [
    'Analyze valuation',
    'Compare to peers',
    'Show risk factors',
    'Generate DCF model',
    'What are key risks?',
    'Explain revenue by segment',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `[Analysis for: ${text}]\n\n- Robust revenue growth with expanding operating leverage\n- Net margins and EBITDA tracking ahead of consensus estimates\n- Strong liquidity position and free cash flow conversion.`,
        },
      ]);
    }, 700);
  };

  if (!isOpen) {
    return (
      <button
        className="btn-ai-floating-reopen"
        onClick={() => setIsOpen(true)}
        title="Open AI Assistant"
      >
        <span className="sparkle-icon">[*]</span>
        <span>AI Assistant</span>
      </button>
    );
  }

  return (
    <aside className="ai-assistant-docked-panel">
      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-title-group">
          <span className="sparkle-symbol">[*]</span>
          <span className="ai-panel-heading">AI Assistant</span>
        </div>
        <div className="ai-header-controls">
          <button
            className="btn-ai-new-chat"
            onClick={() => setMessages([])}
          >
            New Chat
          </button>
          <button
            className="btn-ai-close-panel"
            onClick={() => setIsOpen(false)}
            title="Collapse AI Assistant"
          >
            [X]
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="ai-messages-scroll-area">
        {/* Sample / First User Query */}
        <div className="user-chat-bubble">
          <span>Summarize {selectedSymbol}'s Q1 earnings and key takeaways.</span>
        </div>

        {/* Structured Earnings Summary Card */}
        <div className="ai-response-summary-card">
          <h4 className="summary-company-title">
            {selectedSymbol} Q1 Earnings &amp; Financial Summary
          </h4>

          <ul className="summary-bullets-list">
            <li>
              <strong>Revenue:</strong> ₹10.04L Cr / $119.6B, +2.1% YoY (beat est. +1.8%)
            </li>
            <li>
              <strong>EPS:</strong> ₹105.10 / $2.18, +16.0% YoY (beat consensus est.)
            </li>
            <li>
              <strong>Services Revenue:</strong> Hit all-time record +11% YoY growth
            </li>
            <li>
              <strong>Gross Margin:</strong> 45.9%, up 1.2pp YoY with operational leverage
            </li>
            <li>
              <strong>Balance Sheet:</strong> Strong capital position with robust cash reserves
            </li>
          </ul>

          <div className="summary-section-divider"></div>

          <h5 className="takeaways-heading">Key Takeaways</h5>
          <ol className="takeaways-numbered-list">
            <li>Digital and retail segments remain primary growth engines.</li>
            <li>Consumer demand stabilized significantly better than consensus.</li>
            <li>Gross margin expansion demonstrates strong operational leverage.</li>
            <li>Global expansion pipeline remains on track for second half.</li>
            <li>Robust free cash flow generation supports continuous capital reinvestment.</li>
          </ol>

          {/* Sources Badges */}
          <div className="sources-row-group">
            <span className="sources-label">Sources (4):</span>
            <div className="sources-badges-flex">
              <span className="source-pill">Company IR</span>
              <span className="source-pill">Exchange Filings</span>
              <span className="source-pill">LiveMint</span>
              <span className="source-pill">Reuters</span>
            </div>
          </div>

          {/* Feedback Icons */}
          <div className="feedback-actions-row">
            <button className="btn-feedback" title="Helpful">[+]</button>
            <button className="btn-feedback" title="Not Helpful">[-]</button>
            <button className="btn-feedback" title="Copy Text">[Copy]</button>
          </div>
        </div>

        {/* Additional conversation history */}
        {messages.slice(1).map((m, i) => (
          <div key={i} className={m.sender === 'user' ? 'user-chat-bubble' : 'ai-response-summary-card'}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      {/* Suggested Prompt Chips (2x3 Grid) */}
      <div className="ai-prompt-chips-grid">
        {promptChips.map((prompt) => (
          <button
            key={prompt}
            className="btn-prompt-chip"
            onClick={() => handleSend(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        className="ai-chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <button type="button" className="btn-attach" title="Attach Document">
          [@]
        </button>
        <input
          type="text"
          className="ai-input-text"
          placeholder="Ask anything about markets, companies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-ai-submit" disabled={!input.trim()}>
          [&gt;]
        </button>
      </form>
      <div className="ai-disclaimer-text">
        AI can make mistakes. Verify important info.
      </div>
    </aside>
  );
};
