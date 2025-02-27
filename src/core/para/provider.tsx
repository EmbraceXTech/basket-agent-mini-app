import {
  ParaEvmProvider,
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
  zerionWallet,
} from "@getpara/evm-wallet-connectors";
import { sepolia } from "wagmi/chains";
import para from "./config";

type Props = {
  children: React.ReactNode;
};

export const ParaProviders: React.FC<Props> = ({ children }) => {
  return (
    <ParaEvmProvider
      config={{
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "",
        appName: "BasketAgent",
        chains: [sepolia],
        wallets: [
          metaMaskWallet,
          rainbowWallet,
          walletConnectWallet,
          zerionWallet,
          coinbaseWallet,
          rabbyWallet,
        ],
        para: para,
      }}
    >
      {children}
    </ParaEvmProvider>
  );
};
