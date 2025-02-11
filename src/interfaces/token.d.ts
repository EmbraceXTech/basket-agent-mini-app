export interface IToken {
  tokenSymbol: string;
  tokenAddress: string;
}

export interface ITokenBalance {
  tokenSymbol: string;
  tokenAddress: string;
  balance: number;
  balanceUsd: number;
  pnl: number;
}
