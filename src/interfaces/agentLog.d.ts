export interface IAgentLogResponse {
  id: number;
  createdAt: Date;
  agentId: number;
  thought: string;
  action: string;
  amount: number;
  tokenAddr: string;
}

export type IAgentLog = IAgentLogResponse;
