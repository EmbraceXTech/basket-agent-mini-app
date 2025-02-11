import type { IToken } from "./token";
import type { IKnowledgeResponse, IKnowledgeRequest } from "./knowledge";

export interface IAgentRequest {
  name: string;
  chainId: string;
  selectedTokens: IToken[];
  knowledges: IKnowledgeRequest[];
  strategy: string;
  intervalSeconds: number;
  endDate: Date;
  stopLossUSD?: number;
  takeProfitUSD?: number;
}

export interface IAgentResponse {
  id: number;
  name: string;
  userId: number;
  chainId: string;
  selectedTokens: string[];
  strategy: string;
  intervalSeconds: number;
  stopLossUSD: number | null;
  takeProfitUSD: number | null;
  isRunning: boolean;
  endDate: Date | null;
  createdAt: string;
  pnl?: number;
  usdBalance?: number;
}

export interface IAgentInfoResponse {
  id: number;
  name: string;
  userId: number;
  chainId: string;
  selectedTokens: string[];
  strategy: string;
  intervalSeconds: number;
  stopLossUSD: number | null;
  takeProfitUSD: number | null;
  isRunning: boolean;
  endDate: Date | null;
  createdAt: string;
  knowledge: IKnowledgeResponse[];
  walletKey: {
    address: string;
  };
}

export interface IAgent extends Omit<IAgentResponse, 'selectedTokens'> {
  selectedTokens: IToken[];
}

export interface IAgentInfo extends Omit<IAgentInfoResponse, 'selectedTokens'> {
  selectedTokens: IToken[];
}

export interface IAgentWalletBalanceResponse {
  balances: Array<Array<string>>;
}

export interface IAgentWalletBalance {
  tokenSymbol: string;
  balance: string;
}
