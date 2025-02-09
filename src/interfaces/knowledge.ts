export interface IKnowledge {
  name: string;
  value: string;
}

export interface IKnowledgeResponse {
  id: number;
  agentId: number;
  name: string;
  content: string;
  createdAt: string;
}