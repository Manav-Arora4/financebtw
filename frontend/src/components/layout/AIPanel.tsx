import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import './AIPanel.css';

/* ── Icons ──────────────────────────────────────────────── */
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ThumbUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PaperclipIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);

/* ── Prompt Chips ───────────────────────────────────────── */
const CHIPS = [
  'Summarize Q1 earnings',
  'Compare to peers',
  'Key risk factors',
  'Generate DCF model',
  'Revenue breakdown',
  'Technical analysis',
];

interface SampleMessage {
  role: 'user' | 'assistant';
  text?: string;
  title?: string;
  bullets?: { label: string; value: string }[];
  takeaways?: string[];
  sources?: string[];
}

const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    role: 'user',
    text: 'Summarize Reliance Industries Q1 FY2025 earnings and key takeaways.',
  },
  {
    role: 'assistant',
    title: 'Reliance Industries Q1 FY2025 Earnings Summary',
    bullets: [
      { label: 'Revenue', value: '₹10.04L Cr, +8.2% YoY (beat est. ₹9.85L Cr)' },
      { label: 'EPS', value: '₹105.10, +7.1% YoY (beat consensus)' },
      { label: 'Digital & Retail revenue', value: 'Record high, +11.2% YoY' },
      { label: 'Jio ARPU', value: '₹181.7/month — expanding operating leverage' },
      { label: 'Gross margin', value: '34.9%, up 1.2pp YoY' },
      { label: 'Free Cash Flow', value: '₹48,200 Cr generated' },
    ],
    takeaways: [
      'Digital and retail segments remain primary growth engines.',
      'Consumer demand stabilized better than expected.',
      'Margin expansion shows operational leverage across verticals.',
      'New energy rollout on track for H2.',
      'Strong balance sheet with robust cash conversion.',
    ],
    sources: ['NSE Filings', 'Company IR', 'Economic Times', 'Mint', 'Moneycontrol'],
  },
];

/* ── Resize handle ──────────────────────────────────────── */
const PANEL_MIN = 280;
const PANEL_MAX = 520;

export const AIPanel: React.FC = () => {
  const { aiPanelOpen, toggleAIPanel, aiPanelWidth, setAIPanelWidth } = useAppStore();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const isDragging = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Resize logic */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const startX = e.clientX;
    const startW = aiPanelWidth;

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = startX - ev.clientX; // dragging left increases width
      const newW = Math.min(PANEL_MAX, Math.max(PANEL_MIN, startW + delta));
      setAIPanelWidth(newW);
    };

    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [aiPanelWidth, setAIPanelWidth]);

  /* Auto-grow textarea */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  if (!aiPanelOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const resp = SAMPLE_MESSAGES[1];

  return (
    <>
      {/* Resize handle — sits to the left of the panel */}
      <div
        className="fs-ai-resize-handle"
        onMouseDown={onMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize Research Copilot panel"
      />

      <aside
        ref={panelRef}
        className="fs-ai-panel"
        style={{ width: aiPanelWidth }}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div className="fs-ai-panel__header">
          <div className="fs-ai-panel__title">
            <SparkleIcon />
            <span>Research Copilot</span>
          </div>
          <div className="fs-ai-panel__header-actions">
            <button className="fs-ai-panel__new-chat-btn">New Chat</button>
            <button
              className="fs-ai-panel__close-btn"
              onClick={toggleAIPanel}
              aria-label="Close Research Copilot"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ── Message area ────────────────────────────────── */}
        <div className="fs-ai-panel__messages">
          {/* User message */}
          <div className="fs-ai-bubble fs-ai-bubble--user">
            <span>{SAMPLE_MESSAGES[0].text}</span>
          </div>

          {/* Assistant response */}
          <div className="fs-ai-bubble fs-ai-bubble--assistant">
            <h4 className="fs-ai-response__title">{resp.title}</h4>

            <ul className="fs-ai-response__bullets">
              {resp.bullets?.map((b) => (
                <li key={b.label}>
                  <strong>{b.label}:</strong> {b.value}
                </li>
              ))}
            </ul>

            <div className="fs-ai-response__divider" />

            <h5 className="fs-ai-response__subtitle">Key Takeaways</h5>
            <ol className="fs-ai-response__takeaways">
              {resp.takeaways?.map((t) => <li key={t}>{t}</li>)}
            </ol>

            {/* Sources */}
            <div className="fs-ai-response__sources">
              <span className="fs-ai-response__sources-label">Sources ({resp.sources?.length ?? 0})</span>
              <div className="fs-ai-response__sources-pills">
                {resp.sources?.map((s) => (
                  <span key={s} className="fs-ai-source-pill">{s}</span>
                ))}
              </div>
            </div>

            {/* Feedback row */}
            <div className="fs-ai-response__feedback">
              <button className="fs-ai-feedback-btn" title="Helpful"><ThumbUpIcon /></button>
              <button className="fs-ai-feedback-btn" title="Not helpful"><ThumbDownIcon /></button>
              <button className="fs-ai-feedback-btn" title="Copy" onClick={handleCopy}>
                <CopyIcon />
                {copied && <span className="fs-ai-copied">Copied</span>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Prompt chips ────────────────────────────────── */}
        <div className="fs-ai-panel__chips">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              className="fs-ai-chip"
              onClick={() => setInput(chip)}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ── Input ───────────────────────────────────────── */}
        <div className="fs-ai-panel__input-wrap">
          <form
            className="fs-ai-input-bar"
            onSubmit={(e) => { e.preventDefault(); setInput(''); }}
          >
            <button type="button" className="fs-ai-attach-btn" title="Attach document">
              <PaperclipIcon />
            </button>
            <textarea
              ref={textareaRef}
              className="fs-ai-input"
              rows={1}
              placeholder="Ask anything about NSE / BSE stocks, earnings, charts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setInput(''); }
              }}
            />
            <button
              type="submit"
              className="fs-ai-send-btn"
              disabled={!input.trim()}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>
          <div className="fs-ai-disclaimer">
            Responses may be inaccurate. Verify important information independently.
          </div>
        </div>
      </aside>
    </>
  );
};
