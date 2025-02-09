import { IAgentInfo } from "@/interfaces/agent";
import EthereumQRGenerator from "../base/EthereumQRGenerator";
import { Button } from "@heroui/react";

export default function ManageAsset({ agentInfo }: { agentInfo: IAgentInfo }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(agentInfo.walletKey.address);
  };
  const mockContractAddress = "0x1234567890abcdef1234567890abcdef12345678";
  return (
    <div>
      <div>Manage Asset</div>
      <EthereumQRGenerator
        toAddress={agentInfo.walletKey.address}
        chainId={agentInfo.chainId}
        tokenAddress={mockContractAddress}
        isNativeToken={false}
      />
      <div>{agentInfo.walletKey.address}</div>
      <Button onPress={handleCopy}>Copy</Button>
    </div>
  );
}
