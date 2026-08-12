import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Array<{ source: string; detail: string }>;
  toolsUsed?: string[];
}

export const ChatPage: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      content: `Welcome to FinanceBtw AI Research Assistant. I am equipped with LangGraph autonomous reasoning, LlamaIndex hybrid financial RAG (BGE-M3 + Qdrant), and live market data feeds for ${selectedSymbol}. How can I assist your financial analysis today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: [
        { source: 'MarketProvider: YahooFinance', detail: 'Real-time equity quotes and fundamentals' },
        { source: 'LlamaIndex: Qdrant VectorStore', detail: 'Pre-indexed SEBI filings & earnings transcripts' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    `Analyze ${selectedSymbol} valuation ratios & operating margins`,
    'Compare TCS vs INFY dividend yields and P/E ratios',
    'What are SEBI regulations on insider trading disclosures?',
    'Summarize recent institutional FII/DII activity',
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

    // Simulated assistant response (LangGraph connection in Phase 10)
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: `[Analysis for: ${text}]\n\nBased on retrieved market data and fundamental filings for ${selectedSymbol}:\n- Current Market Cap & Valuation: Trading within historical percentiles.\n- Fundamental Health: Robust balance sheet with positive cash flows.\n- Risk Considerations: Monitor macroeconomic interest rate shifts and sector-specific headwinds.\n\n(Full autonomous LangGraph multi-step agent reasoning will be activated in Phase 10).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolsUsed: ['yfinance_quote_provider', 'llamaindex_hybrid_retriever', 'litellm_gateway'],
        citations: [
          { source: 'YahooFinanceProvider', detail: `Quote & Fundamentals for ${selectedSymbol}` },
          { source: 'TheNewsAPIProvider', detail: 'Recent business headlines' },
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chat-layout">
      {/* Main Chat Feed */}
      <div className="chat-main">
        <div className="chat-header-bar">
          <div>
            <h3 className="chat-title">[AI Financial Research Chat]</h3>
            <span className="chat-subtitle">Target Asset: <code>{selectedSymbol}</code> | Powered by LangGraph + LlamaIndex</span>
          </div>
          <span className="badge badge-success">[LiteLLM: Groq GPT-OSS 120B]</span>
        </div>

        {/* Message Stream */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-container ${msg.sender}`}>
              <div className="chat-bubble">
                <div className="chat-sender-tag">
                  {msg.sender === 'user' ? '[USER]' : '[AI ASSISTANT]'}
                  <span className="chat-time">{msg.timestamp}</span>
                </div>
                <div className="chat-text">{msg.content}</div>

                {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                  <div className="tool-chips">
                    <span className="tool-label">Tools:</span>
                    {msg.toolsUsed.map((t) => (
                      <span key={t} className="tool-chip">[{t}]</span>
                    ))}
                  </div>
                )}

                {msg.citations && msg.citations.length > 0 && (
                  <div className="citations-box">
                    <span className="citations-title">[PROVENANCE CITATIONS]</span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="citation-item">
                        <strong>[{c.source}]</strong> {c.detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-container assistant">
              <div className="chat-bubble typing">
                <span>[*] LangGraph Planner executing reasoning &amp; tool retrieval...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="prompt-chips">
          {samplePrompts.map((prompt) => (
            <button key={prompt} className="prompt-chip" onClick={() => handleSend(prompt)}>
              [+] {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder={`Ask anything about ${selectedSymbol}, balance sheets, or Indian markets...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!input.trim() || isTyping}>
            Send
          </button>
        </form>
      </div>

      {/* Right Asset Sidebar Context */}
      <aside className="chat-asset-panel">
        <div className="card glass">
          <div className="card-header">
            <h4 className="card-title">Selected Asset</h4>
            <span className="badge badge-info">LIVE FEED</span>
          </div>
          <div className="asset-headline">
            <h2>{selectedSymbol}</h2>
            <div className="asset-price-row">
              <span className="asset-price">₹2,985.50</span>
              <span className="badge badge-success">[+1.09%]</span>
            </div>
          </div>
          <div className="asset-stats-list">
            <div className="asset-stat-row"><span>Exchange:</span><strong>NSE / BSE</strong></div>
            <div className="asset-stat-row"><span>P/E Ratio:</span><strong>28.4x</strong></div>
            <div className="asset-stat-row"><span>P/B Ratio:</span><strong>2.6x</strong></div>
            <div className="asset-stat-row"><span>ROE:</span><strong>14.2%</strong></div>
            <div className="asset-stat-row"><span>52W High:</span><strong>₹3,217.90</strong></div>
            <div className="asset-stat-row"><span>52W Low:</span><strong>₹2,220.30</strong></div>
            <div className="asset-stat-row"><span>Data Source:</span><strong>YahooFinance / NSE</strong></div>
          </div>
        </div>
      </aside>
    </div>
  );
};
