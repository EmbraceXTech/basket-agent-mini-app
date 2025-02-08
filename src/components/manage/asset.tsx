import { IAgentResponse } from "@/interfaces/agent";
import EthereumQRGenerator from "../base/EthereumQRGenerator";
import { Button } from "@heroui/react";

export default function ManageAsset({ agent }: { agent: IAgentResponse }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(agent.walletAddress);
  };
  return (
    <div>
      <div>Manage Asset</div>
      <EthereumQRGenerator
        ethAddress={agent.walletAddress}
        chainId={agent.chainId}
      />
      <div>{agent.walletAddress}</div>
      <Button onPress={handleCopy}>Copy</Button>
    </div>
  );
}
