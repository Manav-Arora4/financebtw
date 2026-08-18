import React, { useState } from 'react';
import type { ReasoningStep } from './types';
import './ResearchReasoningBar.css';

interface Props {
  steps: ReasoningStep[];
  isStreaming?: boolean;
}

export const ResearchReasoningBar: React.FC<Props> = ({ steps, isStreaming }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!steps || steps.length === 0) return null;

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const isAllComplete = completedCount === steps.length && !isStreaming;

  return (
    <div className={`research-reasoning-container ${isExpanded ? 'expanded' : ''}`}>
      <button
        type="button"
        className="reasoning-summary-bar"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="reasoning-status-left">
          <span className={`reasoning-status-dot ${isAllComplete ? 'completed' : 'active'}`} />
          <span className="reasoning-title-text">
            {isAllComplete
              ? `Agent Reasoning Complete (${steps.length} steps executed)`
              : `Synthesizing Financial Telemetry... (${completedCount}/${steps.length})`}
          </span>
        </div>

        <div className="reasoning-toggle-right">
          <span className="reasoning-step-badge">
            {completedCount}/{steps.length}
          </span>
          <span className="reasoning-chevron">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="reasoning-steps-timeline">
          {steps.map((step, idx) => {
            const isDone = step.status === 'completed';
            const isCurrent = step.status === 'running';

            return (
              <div key={step.id || idx} className={`reasoning-step-row ${step.status}`}>
                <div className="step-marker-col">
                  <div className={`step-dot ${isDone ? 'done' : isCurrent ? 'running' : 'pending'}`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  {idx < steps.length - 1 && <div className="step-line" />}
                </div>

                <div className="step-content-col">
                  <div className="step-title-line">
                    <span className="step-name">{step.title}</span>
                    {step.durationMs && (
                      <span className="step-duration">{step.durationMs}ms</span>
                    )}
                  </div>
                  {step.detail && <p className="step-detail-text">{step.detail}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
