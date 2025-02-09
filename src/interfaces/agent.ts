export interface IToken {
  symbol: string;
  icon: string;
  address: string;
}

export interface IAgent {
  id: number;
  name: string;
  isRunning: boolean;
  usdBalance: number;
  pnl: number;
  tokens: IToken[];
  createdAt: string;
  walletKey: {
    address: string;
  };
} 