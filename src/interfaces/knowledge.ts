export interface IKnowledgeR {
  name: string;
  value: string;
}

export interface IKnowledgeRequest {
  name: string;
  content: string;
}

export interface IKnowledgeResponse {
  id: number;
  agentId: number;
  name: string;
  content: string;
  createdAt: string;
}