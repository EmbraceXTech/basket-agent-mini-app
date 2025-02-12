export interface IChainExplorer {
  name: string;
  url: string;
  standard: string;
  icon?: string;
}

export interface INativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface IChain {
  name: string;
  chain: string;
  rpc: string[];
  faucets: string[];
  nativeCurrency: INativeCurrency;
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  icon: string;
  explorers: IChainExplorer[];
  status: string;
  iconUrl: string;
}
