import { Coinbase } from "@coinbase/coinbase-sdk";

export const CHAIN_LIST = {
  "8453": {
    chainId: "8453",
    rpcUrl: "https://base-mainnet.public.blastapi.io",
    explorerUrl: "https://basescan.org",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorer: "https://basescan.org",
    chainName: "Base Mainnet",
    shortName: "base",
    network: Coinbase.networks.BaseMainnet,
    imageUrl: "https://assets.coinbase.com/assets/base-logo-1654116827597.png",
  },
};
