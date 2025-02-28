import type { IToken } from "./token";
import type { IChain } from "./chain";
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

export interface IAgent extends Omit<IAgentResponse, "selectedTokens"> {
  selectedTokens: IToken[];
  totalBalance?: number;
  performance?: number;
  equity?: number;
  chainInfo?: IChain;
}

export interface IAgentInfo extends IAgentInfoResponse {
  selectedTokens: IToken[];
  chainInfo?: IChain;
}

export interface IWithdrawAssetRequest {
  assetId: "eth" | "usdc";
  amount: number;
  recipientAddress: string;
}

export interface IWithdrawAssetResponse {
  transactionHash: string;
}

export interface BuyDto {
  tokenAddress: string;
  usdAmount: number;
}

export interface SellDto {
  tokenAddress: string;
  tokenAmount: number;
}

export type TradeStep = {
  type: 'buy';
  data: BuyDto;
  reason: string;
} | {
  type: 'sell';
  data: SellDto;
  reason: string;
}

export type TradePlan = {
  steps: TradeStep[];
}

export interface TradeStep {
  step: number;
  thought: string;
  action: string;
}

export interface ISimulateTradeRequest {
  strategyDescription: string
}

export interface ISimulateTradeResponse {
  thoughts: string;
  tradeSteps: TradeStep[];
}