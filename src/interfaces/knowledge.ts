export interface IKnowledgeRequest {
  id?: number;
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

export interface IKnowledge {
  id: number;
  agentId: number;
  name: string;
  content: string;
}

export interface IUpdateKnowledgeRequest {
  id: number;
  name: string;
  content: string;
}
