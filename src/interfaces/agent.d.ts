import type { IToken } from "./token";

export interface IAgentRequest {
  name: string;
  chainId: string;
  selectedTokens: IToken[];
  strategy: string;
  walletAddress: string;
  intervalSeconds: number;
  endDate: Date;
  stopLossUSD?: number;
  takeProfitUSD?: number;
}

export interface IAgentResponse {
  id: string;
  name: string;
  chainId: string;
  selectedTokens: IToken[];
  strategy: string;
  walletAddress: string;
  intervalSeconds: number;
  endDate: Date;
  stopLossUSD?: number;
  takeProfitUSD?: number;
  isRunning: boolean;
}
