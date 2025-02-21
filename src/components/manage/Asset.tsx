import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Tab, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { IAgentInfo } from "@/interfaces/agent";
import { truncateAddress } from "@/utils/string.util";

import EthereumQRGenerator from "../base/EthereumQRGenerator";
import tokenApi from "@/services/token.service";

export default function ManageAsset({ agentInfo }: { agentInfo: IAgentInfo }) {
  const [isCopied, setIsCopied] = useState(false);

  const { data: tokenInfo } = useQuery({
    queryKey: ["tokenInfo", agentInfo.chainId],
    queryFn: () => tokenApi.getTokenAvailable(agentInfo.chainId, true),
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(agentInfo.walletKey.address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div>
      <div className="text-xl font-medium text-center mt-6">Deposit Crypto</div>
      <div
        className="flex items-center justify-center space-x-1 mt-2 cursor-pointer"
        onClick={handleCopy}
      >
        <div className="text-sm text-secondary-text">
          {truncateAddress(agentInfo.walletKey.address)}
        </div>
        <button onClick={handleCopy} id="copy-address">
          {isCopied ? (
            <CheckCircleIcon className="w-4 h-4" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="mt-6 my-10 flex flex-col items-center justify-center">
        <Tabs
          aria-label="Tabs radius"
          radius="full"
          variant="underlined"
          color="primary"
          fullWidth
          classNames={{
            tab: "h-fit",
          }}
        >
          <Tab
            key="gasToken"
            title={
              <div className="flex flex-col items-center space-y-1">
                <img
                  src={
                    tokenInfo?.find(
                      (token) => token.symbol.toUpperCase() === "ETH"
                    )?.logoURI
                  }
                  alt="ETH"
                  className="w-6 h-6"
                />
                <p className="text-xs font-medium">Gas Token</p>
              </div>
            }
          >
            <div className="my-6">
              {/* native token */}
              <EthereumQRGenerator
                to={agentInfo.walletKey.address}
                chainId={agentInfo.chainId}
                // tokenAddress={agentInfo.walletKey.address}
                isNativeToken={true}
              />
            </div>
          </Tab>
          <Tab
            key="stableCoin"
            title={
              <div className="flex flex-col items-center space-y-1">
                <img
                  src={
                    tokenInfo?.find(
                      (token) => token.symbol.toUpperCase() === "USDC"
                    )?.logoURI
                  }
                  alt="USDC"
                  className="w-6 h-6"
                />
                <p className="text-xs font-medium">Stable Coin</p>
              </div>
            }
          >
            {/* erc20 token */}
            <EthereumQRGenerator
              tokenAddress={
                tokenInfo?.find(
                  (token) => token.symbol.toUpperCase() === "USDC"
                )?.address
              }
              to={agentInfo.walletKey.address}
              chainId={agentInfo.chainId}
              isNativeToken={false}
            />
          </Tab>
        </Tabs>
        <div className="bg-[#F8F9FB] flex space-x-3 px-4 py-2 rounded-full mt-6">
          <img
            src={agentInfo.chainInfo?.iconUrl}
            alt={agentInfo.chainInfo?.name}
            className="w-6 h-6"
          />
          <p className="">{agentInfo.chainInfo?.name}</p>
        </div>
      </div>
      <div className="my-3 border-b border-dashed border-secondary-text mx-8" />
      <p className="text-sm text-secondary-text text-center mt-6 mx-8">
        Fund your wallet by transfering crypto from another wallet or account to
        the address above
      </p>
    </div>
  );
}
