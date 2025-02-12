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

export interface ITokenAvailable {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
  eip2612: boolean;
  tags: string[];
}
