import React from 'react';
import type { ResearchMessage, Citation } from './types';
import { ResearchReasoningBar } from './ResearchReasoningBar';
import { ResearchToolTrace } from './ResearchToolTrace';
import { ResearchFinancialTable } from './ResearchFinancialTable';
import { IconSparkles } from '../icons/Icons';
import './ResearchMessageCard.css';

interface Props {
  message: ResearchMessage;
  onCitationClick: (citation: Citation) => void;
  onFollowUpClick: (prompt: string) => void;
  isLatestStreaming?: boolean;
}

export const ResearchMessageCard: React.FC<Props> = ({
  message,
  onCitationClick,
  onFollowUpClick,
  isLatestStreaming,
}) => {
  const isUser = message.sender === 'user';

  // Render text with clickable citation badges
  const renderFormattedContent = (content: string, citations?: Citation[]) => {
    if (!citations || citations.length === 0) {
      return <div className="message-markdown-text">{content}</div>;
    }

    // Split by citation pattern [1], [2], etc.
    const parts = content.split(/(\[\d+\])/g);

    return (
      <div className="message-markdown-text">
        {parts.map((part, i) => {
          const match = part.match(/\[(\d+)\]/);
          if (match) {
            const citeNum = parseInt(match[1], 10);
            const citation = citations[citeNum - 1];
            return (
              <button
                key={i}
                type="button"
                className="inline-citation-pill"
                onClick={() => citation && onCitationClick(citation)}
                title={citation ? `${citation.documentName} (p. ${citation.pageNumber || 1})` : `Citation [${citeNum}]`}
              >
                [{citeNum}]
              </button>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  if (isUser) {
    return (
      <div className="research-message-row user-row">
        <div className="user-message-bubble">
          <div className="user-bubble-top">
            <span className="user-avatar-tag">User</span>
            {message.symbol && <span className="message-symbol-pill">{message.symbol}</span>}
            <span className="message-time-text">{message.timestamp}</span>
          </div>
          <p className="user-query-text">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="research-message-row assistant-row">
      <div className="assistant-avatar-box">
        <IconSparkles size={14} />
      </div>

      <div className="assistant-message-content">
        <div className="assistant-meta-bar">
          <span className="assistant-agent-name">FinanceBtw Research Copilot</span>
          <span className="model-tag-pill">Groq • Llama 3.3 70B</span>
          <span className="message-time-text">{message.timestamp}</span>
        </div>

        {/* 1. Reasoning Steps Bar */}
        {message.reasoningSteps && message.reasoningSteps.length > 0 && (
          <ResearchReasoningBar
            steps={message.reasoningSteps}
            isStreaming={isLatestStreaming}
          />
        )}

        {/* 2. Structured Financial Tables */}
        {message.financialTables &&
          message.financialTables.map((table, idx) => (
            <ResearchFinancialTable key={idx} table={table} />
          ))}

        {/* 3. Text Body with Citations */}
        {renderFormattedContent(message.content, message.citations)}

        {/* 4. Tool Execution Traces */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <ResearchToolTrace tools={message.toolCalls} />
        )}

        {/* 5. Suggested Follow-up Prompts */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="message-followups-wrap">
            <span className="followups-label">Suggested Inquiries:</span>
            <div className="followups-chips-list">
              {message.suggestedFollowUps.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="followup-chip-btn"
                  onClick={() => onFollowUpClick(prompt)}
                >
                  <span>{prompt}</span>
                  <span className="chip-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
