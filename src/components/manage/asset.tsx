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

  const mockContractAddress = "0x1234567890abcdef1234567890abcdef12345678";
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
          tokenAddress={mockContractAddress}
          isNativeToken={false}
        />
      </div>
      <div className="my-3 border-b border-dashed border-secondary-text mx-8" />
      <p className="text-sm text-secondary-text text-center mt-6 mx-8">
        Fund your wallet by transfering crypto from another wallet or account to
        the address above
      </p>
    </div>
  );
}
