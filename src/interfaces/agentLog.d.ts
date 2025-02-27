export interface IAgentLogResponse {
  id: number;
  createdAt: Date;
  agentId: number;
  content: string;
  logType: string;
}

export type IAgentLog = IAgentLogResponse;
