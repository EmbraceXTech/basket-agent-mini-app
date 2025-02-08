import { IToken } from "@/interfaces/token";
import useStepperStore from "@/stores/createAgent.store";
import { Select, SelectItem } from "@heroui/react";

export default function Step1() {
  const { data, setData } = useStepperStore();
  const chains = [
    { chainId: "1", label: "Ethereum" },
    { chainId: "56", label: "Binance" },
    { chainId: "137", label: "Polygon" },
  ];
  const tokens: IToken[] = [
    {
      tokenSymbol: "eth",
      tokenAddress: "0x0000000000000000000000000000000000000001",
    },
    {
      tokenSymbol: "bnb",
      tokenAddress: "0x0000000000000000000000000000000000000002",
    },
    {
      tokenSymbol: "matic",
      tokenAddress: "0x0000000000000000000000000000000000000003",
    },
  ];
  return (
    <div>
      <Select
        className="max-w-xs"
        disabledKeys={chains
          .filter((chain) => chain.chainId === (data.chainId || ""))
          .map((chain) => chain.chainId)}
        label="Chain"
        placeholder="Select a chain"
        onChange={(e) => {
          setData({ chainId: e.target.value });
        }}
      >
        {chains.map((chain) => (
          <SelectItem key={chain.chainId} value={chain.chainId}>
            {chain.label}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="max-w-xs"
        disabledKeys={tokens
          .filter((token) =>
            data.selectedTokens?.some(
              (selectedToken) =>
                selectedToken.tokenAddress === token.tokenAddress
            )
          )
          .map((token) => token.tokenAddress)}
        label="Token"
        placeholder="Select tokens"
        selectionMode="multiple"
        onChange={(e) => {
          const selectedOptions = Array.from(
            e.target.selectedOptions,
            (option) => option.value
          );
          const selectedTokens = tokens.filter((token) =>
            selectedOptions.includes(token.tokenAddress)
          );
          setData({ selectedTokens });
        }}
      >
        {tokens.map((token) => (
          <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
            {token.tokenSymbol}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
