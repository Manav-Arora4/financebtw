import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Array<{ source: string; detail: string }>;
  toolsUsed?: string[];
  langgraphPlan?: string[];
}

export const ChatPage: React.FC = () => {
  const { selectedSymbol } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      content: `FINANCEBTW TERMINAL INTELLIGENCE // WORKSTATION READY\n\nActive Security: ${selectedSymbol} <EQUITY>\nAgent Engine: LangGraph v0.2 Autonomous State Graph\nRAG Retriever: LlamaIndex Hybrid (BGE-M3 Dense + BM25 + Qdrant)\nCross-Encoder: BAAI/bge-reranker-large\nLLM Gateway: LiteLLM (Groq GPT-OSS 120B / Llama 3.3 70B)\n\nEnter financial queries, corporate action analysis, or DuPont fundamental breakdowns below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      citations: [
        { source: 'MarketProvider: YahooFinance', detail: 'Real-time equity quotes, balance sheet, ratios' },
        { source: 'LlamaIndex: Qdrant VectorStore', detail: 'SEBI filings, FY24 Annual Reports, Transcripts' },
      ],
      toolsUsed: ['yfinance_quote_provider', 'llamaindex_hybrid_retriever', 'litellm_gateway'],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const functionChips = [
    { code: 'FA', label: `Fundamental Analysis for ${selectedSymbol}`, prompt: `Perform full fundamental and DuPont analysis for ${selectedSymbol}` },
    { code: 'VAL', label: 'DCF & Multiples Valuation', prompt: `Calculate DCF fair value and comparative peer valuation for ${selectedSymbol}` },
    { code: 'RISK', label: 'VaR & Portfolio Beta', prompt: `Analyze beta, downside volatility, and macroeconomic sensitivity for ${selectedSymbol}` },
    { code: 'QR', label: 'Q3 Earnings Summary', prompt: `Summarize key revenue growth drivers and EBITDA margins from ${selectedSymbol} recent earnings` },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: `[ANALYSIS REPORT // ${selectedSymbol}]\n\n1. VALUATION & METRICS:\n- Current Price: ₹2,985.50 (P/E: 28.4x vs Sector Avg: 26.8x)\n- EV/EBITDA: 16.2x | P/B: 2.6x | Dividend Yield: 0.35%\n\n2. DUPONT RETURN ON EQUITY (14.2%):\n- Net Profit Margin: 11.20%\n- Asset Turnover: 0.62x\n- Equity Multiplier: 2.05x\n\n3. FINANCIAL HEALTH & CAPITAL STRUCTURE:\n- Total Debt/Equity: 0.42 | Interest Coverage: 8.4x\n- Free Cash Flow Yield: 3.8% with robust operating margins.\n\n4. RAG KNOWLEDGE BASE CITATION:\n- Ingested Annual Report confirms capex allocation towards retail and green energy divisions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        langgraphPlan: [
          'State Checkpoint: Init conversation context',
          'Tool Route: yfinance_quote_provider -> Success (200 OK)',
          'Tool Route: llamaindex_hybrid_retriever -> 4 Chunks Retrieved',
          'Reranker: BGE-Reranker-Large -> Top 2 Nodes Selected (score > 0.88)',
          'Synthesizer: Groq GPT-OSS 120B via LiteLLM -> Final Generation',
        ],
        toolsUsed: ['yfinance_provider', 'llamaindex_retriever', 'bge_reranker', 'litellm_gateway'],
        citations: [
          { source: 'YahooFinanceProvider', detail: `Live quotes and metrics for ${selectedSymbol}` },
          { source: 'LlamaIndex: Qdrant', detail: `${selectedSymbol} Integrated Annual Report FY24 (p. 42-45)` },
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="terminal-chat-workstation">
      {/* Left Chat & Terminal Stream */}
      <div className="terminal-chat-main">
        <div className="term-chat-header">
          <div className="term-chat-title">
            <span className="terminal-prompt-prefix">FB_AI&gt;</span>
            <span>AUTONOMOUS FINANCIAL AI WORKSTATION</span>
          </div>
          <div className="term-meta-badges">
            <span className="term-badge amber">[LANGGRAPH v0.2]</span>
            <span className="term-badge green">[LLAMAINDEX HYBRID]</span>
            <span className="term-badge cyan">[GROQ GPT-OSS 120B]</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="term-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`term-msg-container ${msg.sender}`}>
              <div className="term-msg-bubble">
                <div className="term-msg-header">
                  <span className="term-msg-sender">
                    {msg.sender === 'user' ? 'USER@TERMINAL' : 'AI_AGENT@FINANCEBTW'}
                  </span>
                  <span className="term-msg-time">[{msg.timestamp}]</span>
                </div>

                {/* Content */}
                <div className="term-msg-text">{msg.content}</div>

                {/* LangGraph Plan Trace */}
                {msg.langgraphPlan && msg.langgraphPlan.length > 0 && (
                  <div className="langgraph-trace-box">
                    <div className="trace-title">[LANGGRAPH AGENT EXECUTION TRACE]</div>
                    {msg.langgraphPlan.map((step, idx) => (
                      <div key={idx} className="trace-step">
                        <span className="trace-num">&gt;&gt; STEP {idx + 1}:</span> {step}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tool Execution Chips */}
                {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                  <div className="term-tool-chips">
                    <span className="tool-lbl">TOOLS:</span>
                    {msg.toolsUsed.map((t) => (
                      <span key={t} className="term-tool-tag">&lt;{t}&gt;</span>
                    ))}
                  </div>
                )}

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="term-citations-box">
                    <span className="citations-tag">[PROVENANCE &amp; CITATIONS]</span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="c-item">
                        <strong>[{c.source}]</strong> {c.detail}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="term-msg-container assistant">
              <div className="term-msg-bubble typing">
                <span className="typing-cursor">[*] LangGraph StateGraph executing multi-step planning &amp; RAG retrieval...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Bloomberg Function Chips */}
        <div className="term-function-chips">
          {functionChips.map((chip) => (
            <button
              key={chip.code}
              className="term-fn-chip"
              onClick={() => handleSend(chip.prompt)}
            >
              <span className="fn-code">&lt;{chip.code}&gt;</span>
              <span className="fn-label">{chip.label}</span>
            </button>
          ))}
        </div>

        {/* Command Form */}
        <form
          className="term-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <span className="cmd-arrow">&gt;&gt;</span>
          <input
            type="text"
            className="term-chat-input"
            placeholder={`Ask anything about ${selectedSymbol}, filings, margins, or type a command...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-term-send" disabled={!input.trim() || isTyping}>
            &lt;SEND / GO&gt;
          </button>
        </form>
      </div>

      {/* Right Financial Tear Sheet Pane */}
      <aside className="terminal-tearsheet-panel">
        <div className="tearsheet-card">
          <div className="tearsheet-header">
            <span className="tearsheet-code">&lt;FA&gt;</span>
            <span className="tearsheet-title">FINANCIAL TEAR SHEET</span>
          </div>

          <div className="tearsheet-asset">
            <div className="ts-symbol">{selectedSymbol}</div>
            <div className="ts-price pos">₹2,985.50 <small>[+1.09%]</small></div>
          </div>

          {/* DuPont Analysis Block */}
          <div className="ts-section">
            <div className="ts-section-title">[DUPONT ROE BREAKDOWN]</div>
            <div className="ts-row"><span>Net Margin:</span><strong className="pos">11.20%</strong></div>
            <div className="ts-row"><span>Asset Turnover:</span><strong>0.62x</strong></div>
            <div className="ts-row"><span>Financial Leverage:</span><strong>2.05x</strong></div>
            <div className="ts-row highlight"><span>Return on Equity:</span><strong className="pos">14.20%</strong></div>
          </div>

          {/* Valuation Multiples */}
          <div className="ts-section">
            <div className="ts-section-title">[VALUATION MULTIPLES]</div>
            <div className="ts-row"><span>P/E Ratio (TTM):</span><strong>28.4x</strong></div>
            <div className="ts-row"><span>Forward P/E:</span><strong>24.1x</strong></div>
            <div className="ts-row"><span>EV / EBITDA:</span><strong>16.2x</strong></div>
            <div className="ts-row"><span>Price / Book:</span><strong>2.6x</strong></div>
            <div className="ts-row"><span>Dividend Yield:</span><strong>0.35%</strong></div>
          </div>

          {/* Capital Structure & Solvency */}
          <div className="ts-section">
            <div className="ts-section-title">[CAPITAL &amp; SOLVENCY]</div>
            <div className="ts-row"><span>Total Debt / Equity:</span><strong>0.42</strong></div>
            <div className="ts-row"><span>Interest Coverage:</span><strong className="pos">8.4x</strong></div>
            <div className="ts-row"><span>Current Ratio:</span><strong>1.35x</strong></div>
            <div className="ts-row"><span>Beta (1Y vs NIFTY):</span><strong>0.94</strong></div>
          </div>
        </div>
      </aside>
    </div>
  );
};
