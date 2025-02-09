import { IAgent } from "@/interfaces/agent";
import EthereumQRGenerator from "../base/EthereumQRGenerator";
import { Button } from "@heroui/react";

export default function ManageAsset({ agent }: { agent: IAgent }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(agent.walletAddress);
  };
  const mockContractAddress = "0x1234567890abcdef1234567890abcdef12345678";
  return (
    <div>
      <div>Manage Asset</div>
      <EthereumQRGenerator
        toAddress={agent.walletAddress}
        chainId={agent.chainId}
        tokenAddress={mockContractAddress}
        isNativeToken={false}
      />
      <div>{agent.walletAddress}</div>
      <Button onPress={handleCopy}>Copy</Button>
    </div>
  );
}
