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
  model: {
    address_id: string;
    amount: string;
    asset: {
      asset_id: string;
      contract_address: string;
      decimals: number;
      network_id: string;
    };
    destination: string;
    gasless: boolean;
    network_id: string;
    transaction: {
      content: {
        from: string;
        to: string;
      };
      from_address_id: string;
      network_id: string;
      signed_payload: string;
      status: string;
      transaction_hash: string;
      transaction_link: string;
      unsigned_payload: string;
    };
    transfer_id: string;
    wallet_id: string;
  };
}
