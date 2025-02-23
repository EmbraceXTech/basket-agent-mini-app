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

export interface IAgentWalletBalanceResponse {
  tokens: [string, string][]; // [tokenSymbol, balanceToken]
  balance: number;
  equity: number;
  performance: number;
}
export interface IAgentWalletBalance extends IAgentWalletBalanceResponse {
  balanceUsd?: [string, number][]; // [tokenSymbol, balanceUsd]
  tokenInfo?: ITokenAvailable[];
  tokenPrice?: ITokenPriceResponse[];
}
export interface ITokenPriceResponse {
  token: string;
  price: number;
  source: string;
  quote: string;
}
