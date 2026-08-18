import React, { useRef, useEffect, useState } from 'react';
import type { ResearchMessage, Citation } from './types';
import { ResearchMessageCard } from './ResearchMessageCard';
import { IconSparkles, IconSend, IconCopy, IconTrash } from '../icons/Icons';
import './ResearchChatCanvas.css';

interface Props {
  sessionTitle: string;
  symbol?: string;
  messages: ResearchMessage[];
  onSendMessage: (query: string, symbol?: string) => void;
  onCitationClick: (citation: Citation) => void;
  onClearThread: () => void;
  isStreaming?: boolean;
}

const PROMPT_CHIPS = [
  { label: 'DuPont ROE Breakdown', query: 'Decompose ROE into Net Margin, Asset Turnover, and Equity Multiplier over the last 3 quarters.' },
  { label: 'Valuation & Multiples', query: 'Analyze current P/E, P/B, and EV/EBITDA ratios vs 5-year historical medians.' },
  { label: 'Q3 Earnings Synthesis', query: 'Summarize Q3 FY25 financial performance, revenue growth drivers, and margin compression risks.' },
  { label: 'SEBI Corporate Actions', query: 'Check recent regulatory disclosures, share pledges, and dividend announcements.' },
];

export const ResearchChatCanvas: React.FC<Props> = ({
  sessionTitle,
  symbol,
  messages,
  onSendMessage,
  onCitationClick,
  onClearThread,
  isStreaming,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const clean = symbol ? symbol.replace('.NS', '').replace('.BO', '') : 'RELIANCE';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isStreaming) return;
    onSendMessage(inputQuery.trim(), symbol);
    setInputQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyTranscript = () => {
    const transcript = messages
      .map((m) => `### ${m.sender.toUpperCase()} (${m.timestamp})\n${m.content}\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="research-chat-canvas">
      {/* Header Bar */}
      <header className="research-canvas-header">
        <div className="canvas-header-left">
          <div className="session-brand-group">
            <h2 className="canvas-session-title">{sessionTitle || 'Interactive Financial Research'}</h2>
            <div className="canvas-session-meta">
              <span className="session-symbol-tag">{clean}</span>
              <span className="meta-sep">•</span>
              <span className="session-model-badge">Groq • Llama 3.3 70B (Fast Inference 140 t/s)</span>
            </div>
          </div>
        </div>

        <div className="canvas-header-actions">
          <button
            type="button"
            className="btn-canvas-action"
            onClick={handleCopyTranscript}
            title="Copy entire research thread to markdown"
          >
            <IconCopy size={13} />
            <span>{copied ? 'Copied Markdown' : 'Copy Thread'}</span>
          </button>
          <button
            type="button"
            className="btn-canvas-action danger"
            onClick={onClearThread}
            title="Clear all messages in this thread"
          >
            <IconTrash size={13} />
            <span>Clear</span>
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="research-messages-viewport">
        {messages.length === 0 ? (
          <div className="research-canvas-empty">
            <div className="canvas-empty-icon">
              <IconSparkles size={24} />
            </div>
            <h3 className="canvas-empty-heading">Autonomous Financial Research Workstation</h3>
            <p className="canvas-empty-sub">
              Ask deep questions about <strong>{clean}</strong> or any Indian equity. The agent will formulate queries, execute tool actions against live market APIs and filings, compute DuPont ratios, and return transparent citations.
            </p>

            <div className="canvas-empty-chips-box">
              <span className="chips-box-label">Quick Research Inquiries:</span>
              <div className="empty-chips-grid">
                {PROMPT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="empty-chip-card"
                    onClick={() => onSendMessage(chip.query, symbol)}
                  >
                    <span className="chip-card-title">{chip.label}</span>
                    <span className="chip-card-desc">{chip.query}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="research-messages-stream">
            {messages.map((msg, i) => (
              <ResearchMessageCard
                key={msg.id || i}
                message={msg}
                onCitationClick={onCitationClick}
                onFollowUpClick={(prompt) => onSendMessage(prompt, symbol)}
                isLatestStreaming={isStreaming && i === messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Query Composer Bar */}
      <div className="research-composer-dock">
        {/* Quick Suggestion Chips */}
        <div className="composer-chips-row">
          {PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="composer-prompt-chip"
              onClick={() => onSendMessage(chip.query, symbol)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form className="composer-input-form" onSubmit={handleSubmit}>
          <textarea
            className="composer-textarea"
            placeholder={`Ask research copilot anything about ${clean} (e.g. "Calculate DuPont ROE", "Compare P/E multiple"). Press Enter to run.`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isStreaming}
            className="btn-composer-submit"
            title="Dispatch Research Query"
          >
            <IconSend size={15} />
          </button>
        </form>

        <div className="composer-footer-note">
          <span>Non-advisory research telemetry • Verified against live exchange feeds &amp; corporate filings</span>
        </div>
      </div>
    </div>
  );
};
