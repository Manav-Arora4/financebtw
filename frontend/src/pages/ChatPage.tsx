import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Array<{ source: string; detail: string }>;
}

export const ChatPage: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      content: `Welcome to FinanceBtw AI Research Terminal.\n\nActive Security: ${selectedSymbol}\n\nI can assist you with:\n- Comprehensive fundamental & DuPont Return on Equity analysis\n- Valuation multiples, DCF modeling & peer comparisons\n- Earnings reports, management guidance & revenue drivers\n- Risk attribution, portfolio beta & downside volatility\n\nAsk a question or select a quick analysis function below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        { source: 'Market Quotes', detail: `Live equity quotes & valuation metrics for ${selectedSymbol}` },
        { source: 'Financial Filings', detail: `${selectedSymbol} Integrated Annual Report & Financial Statements` },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const functionChips = [
    { code: 'FA', label: `Fundamental Analysis for ${selectedSymbol}`, prompt: `Perform a fundamental and DuPont ROE breakdown for ${selectedSymbol}` },
    { code: 'VAL', label: 'Valuation & Multiples', prompt: `Analyze valuation multiples (P/E, EV/EBITDA, P/B) for ${selectedSymbol} compared to peers` },
    { code: 'RISK', label: 'Beta & Downside Risk', prompt: `What is the risk profile, beta sensitivity, and solvency health of ${selectedSymbol}?` },
    { code: 'EARN', label: 'Q3 Earnings Summary', prompt: `Summarize the revenue growth and EBITDA margins from ${selectedSymbol}'s recent earnings report` },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: `[FINANCIAL ANALYSIS // ${selectedSymbol}]\n\n1. VALUATION & MARKET POSITION:\n- Current Price: ₹2,985.50 (Trading at 28.4x P/E vs 5-year average of 26.2x)\n- EV / EBITDA: 16.2x | Price to Book: 2.6x | Dividend Yield: 0.35%\n\n2. DUPONT RETURN ON EQUITY BREAKDOWN (14.2% ROE):\n- Net Profit Margin: 11.20% (Stable pricing power and operational discipline)\n- Asset Turnover: 0.62x (Reflects ongoing capital expenditure in new ventures)\n- Equity Multiplier: 2.05x (Prudent leverage ratio)\n\n3. SOLVENCY & BALANCE SHEET STRENGTH:\n- Debt-to-Equity Ratio: 0.42 (Conservative debt profile with strong interest coverage of 8.4x)\n- Free Cash Flow Yield: 3.8% supported by resilient operating cash flows.\n\n4. PROVENANCE & SOURCE REFERENCES:\n- Financial metrics derived from official exchange filings and latest quarterly statements.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [
          { source: 'Market Feed', detail: `Live valuation and price metrics for ${selectedSymbol}` },
          { source: 'Annual Report', detail: `${selectedSymbol} Audited Financial Statements (FY24)` },
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="terminal-chat-workspace">
      {/* Left Main Chat Pane */}
      <div className="chat-terminal-pane">
        <div className="chat-top-bar">
          <div className="chat-bar-title">
            <span className="chat-prompt-tag">AI&gt;</span>
            <span>FINANCIAL RESEARCH ASSISTANT</span>
          </div>
          <div className="chat-badge-group">
            <span className="badge-target">{selectedSymbol}</span>
            <span className="badge-ready">[ANALYST READY]</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="chat-stream-box">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
              <div className="chat-message-bubble">
                <div className="msg-header-line">
                  <span className="msg-author">
                    {msg.sender === 'user' ? 'USER' : 'FINANCIAL ANALYST'}
                  </span>
                  <span className="msg-time">[{msg.timestamp}]</span>
                </div>

                <div className="msg-body-content">{msg.content}</div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="msg-citations-panel">
                    <span className="citations-header">[DATA SOURCES &amp; CITATIONS]</span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="citation-entry">
                        <strong>[{c.source}]</strong> {c.detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-message-row assistant">
              <div className="chat-message-bubble typing">
                <span className="typing-pulse">[*] Analyzing market data and financial filings...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Function Chips */}
        <div className="chat-function-chips">
          {functionChips.map((chip) => (
            <button
              key={chip.code}
              className="function-chip-btn"
              onClick={() => handleSend(chip.prompt)}
            >
              <span className="chip-code">&lt;{chip.code}&gt;</span>
              <span className="chip-text">{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          className="chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <span className="input-arrow">&gt;&gt;</span>
          <input
            type="text"
            className="chat-text-input"
            placeholder={`Ask any question about ${selectedSymbol}, balance sheets, or financial metrics...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-chat-send" disabled={!input.trim() || isTyping}>
            &lt;SEND&gt;
          </button>
        </form>
      </div>

      {/* Right Financial Tear Sheet Pane */}
      <aside className="financial-tearsheet-aside">
        <div className="tearsheet-container">
          <div className="tearsheet-title-row">
            <span className="ts-badge">&lt;FA&gt;</span>
            <span className="ts-heading">FINANCIAL TEAR SHEET</span>
          </div>

          <div className="ts-active-asset">
            <div className="ts-symbol-text">{selectedSymbol}</div>
            <div className="ts-price-text pos">₹2,985.50 <small>[+1.09%]</small></div>
          </div>

          {/* DuPont Analysis */}
          <div className="ts-block">
            <div className="ts-block-title">[DUPONT ROE BREAKDOWN]</div>
            <div className="ts-stat-row"><span>Net Margin:</span><strong className="pos">11.20%</strong></div>
            <div className="ts-stat-row"><span>Asset Turnover:</span><strong>0.62x</strong></div>
            <div className="ts-stat-row"><span>Financial Leverage:</span><strong>2.05x</strong></div>
            <div className="ts-stat-row highlight"><span>Return on Equity:</span><strong className="pos">14.20%</strong></div>
          </div>

          {/* Valuation Multiples */}
          <div className="ts-block">
            <div className="ts-block-title">[VALUATION MULTIPLES]</div>
            <div className="ts-stat-row"><span>P/E Ratio (TTM):</span><strong>28.4x</strong></div>
            <div className="ts-stat-row"><span>Forward P/E:</span><strong>24.1x</strong></div>
            <div className="ts-stat-row"><span>EV / EBITDA:</span><strong>16.2x</strong></div>
            <div className="ts-stat-row"><span>Price / Book:</span><strong>2.6x</strong></div>
            <div className="ts-stat-row"><span>Dividend Yield:</span><strong>0.35%</strong></div>
          </div>

          {/* Capital Structure & Solvency */}
          <div className="ts-block">
            <div className="ts-block-title">[CAPITAL &amp; SOLVENCY]</div>
            <div className="ts-stat-row"><span>Total Debt / Equity:</span><strong>0.42</strong></div>
            <div className="ts-stat-row"><span>Interest Coverage:</span><strong className="pos">8.4x</strong></div>
            <div className="ts-stat-row"><span>Current Ratio:</span><strong>1.35x</strong></div>
            <div className="ts-stat-row"><span>Beta (1Y vs NIFTY):</span><strong>0.94</strong></div>
          </div>
        </div>
      </aside>
    </div>
  );
};
