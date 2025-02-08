import type { IToken } from "./token";

export interface IAgentRequest {
  chainId: string;
  selectedTokens: IToken[];
  strategy: string;
  walletAddress: string;
  intervalSeconds: number;
  endDate: Date;
  stopLossUSD?: number;
  takeProfitUSD?: number;
}