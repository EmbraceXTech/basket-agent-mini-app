import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { IAgentInfo } from "@/interfaces/agent";
import { truncateAddress } from "@/utils/string.util";
import { useState } from "react";

import EthereumQRGenerator from "../base/EthereumQRGenerator";

export default function ManageAsset({ agentInfo }: { agentInfo: IAgentInfo }) {
  const [isCopied, setIsCopied] = useState(false);

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
        <EthereumQRGenerator
          toAddress={agentInfo.walletKey.address}
          chainId={agentInfo.chainId}
          tokenAddress={agentInfo.walletKey.address}
          isNativeToken={false}
        />
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
