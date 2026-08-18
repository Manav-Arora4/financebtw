export interface Citation {
  id: string;
  source: string;
  documentName: string;
  pageNumber?: number;
  excerpt: string;
  confidenceScore: number;
  url?: string;
  filingDate?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  status: 'running' | 'success' | 'cached' | 'failed';
  durationMs: number;
  args: Record<string, unknown>;
  resultSummary?: string;
}

export interface ReasoningStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed';
  durationMs?: number;
  detail?: string;
}

export interface TableRow {
  metric: string;
  q3_fy25?: string;
  q2_fy25?: string;
  q3_fy24?: string;
  yoy?: string;
  isPositive?: boolean;
}

export interface FinancialTableData {
  title: string;
  columns: string[];
  rows: TableRow[];
}

export interface ResearchMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  symbol?: string;
  reasoningSteps?: ReasoningStep[];
  citations?: Citation[];
  toolCalls?: ToolCall[];
  financialTables?: FinancialTableData[];
  suggestedFollowUps?: string[];
}

export interface ResearchSession {
  id: string;
  title: string;
  symbol?: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  messageCount: number;
}
