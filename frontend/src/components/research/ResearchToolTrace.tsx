import React, { useState } from 'react';
import type { ToolCall } from './types';
import './ResearchToolTrace.css';

interface Props {
  tools: ToolCall[];
}

export const ResearchToolTrace: React.FC<Props> = ({ tools }) => {
  const [openToolId, setOpenToolId] = useState<string | null>(null);

  if (!tools || tools.length === 0) return null;

  return (
    <div className="research-tool-traces-wrap">
      <div className="tool-traces-header">
        <span className="tool-traces-label">Tool Execution Traces ({tools.length})</span>
      </div>

      <div className="tool-traces-list">
        {tools.map((tool) => {
          const isOpen = openToolId === tool.id;

          return (
            <div key={tool.id} className={`tool-trace-item ${isOpen ? 'open' : ''}`}>
              <button
                type="button"
                className="tool-trace-summary"
                onClick={() => setOpenToolId(isOpen ? null : tool.id)}
              >
                <div className="tool-trace-left">
                  <span className={`tool-status-dot ${tool.status}`} />
                  <code className="tool-name-code">{tool.name}</code>
                </div>

                <div className="tool-trace-right">
                  <span className="tool-duration-badge">{tool.durationMs}ms</span>
                  <span className="tool-status-text">{tool.status}</span>
                  <span className="tool-chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {isOpen && (
                <div className="tool-trace-body">
                  <div className="tool-payload-section">
                    <span className="tool-section-lbl">Arguments:</span>
                    <pre className="tool-json-preview">
                      {JSON.stringify(tool.args, null, 2)}
                    </pre>
                  </div>
                  {tool.resultSummary && (
                    <div className="tool-payload-section">
                      <span className="tool-section-lbl">Result Preview:</span>
                      <p className="tool-result-text">{tool.resultSummary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
