export interface IAgentLog {
  id: number;
  createdAt: Date;
  agentId: number;
  content: string;
  logType: string;
}

export interface IAgentLogResponse {
  data: IAgentLog[];
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
