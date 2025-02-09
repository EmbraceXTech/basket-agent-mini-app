import { CHAIN_LIST } from "@/constants/chain.constant";
import { TOKEN_LIST } from "@/constants/token.constant";
import useStepperStore from "@/stores/createAgent.store";
import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo } from "react";

export default function Step1() {
  const { data, setData, setCanNext, canNext } = useStepperStore();
  const chains = Object.values(CHAIN_LIST).map((chain) => ({
    label: chain.chainName,
    ...chain,
  }));
  const tokens = useMemo(() => {
    const _tokens = TOKEN_LIST[
      (data.chainId as keyof typeof TOKEN_LIST) || "8453"
    ].map((token) => ({
      tokenSymbol: token.symbol,
      tokenAddress: token.address,
      ...token,
    }));
    return _tokens || [];
  }, [data.chainId]);

  useEffect(() => {
    const _canNext =
      data.chainId && data.selectedTokens && data.selectedTokens?.length > 0 && data.name
        ? true
        : false;
    setCanNext(_canNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.chainId, data.selectedTokens, data.name, canNext]);

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
          setData({ chainId: e.target.value, selectedTokens: [] });
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
        isDisabled={!data.chainId}
        disabledKeys={data.selectedTokens?.map((token) => token.tokenAddress)}
        label="Token"
        placeholder="Select tokens"
        selectionMode="multiple"
        onSelectionChange={(keys) => {
          const selectedOptions = Array.from(keys);
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
      <Input
        label="Agent Name"
        placeholder="Enter agent name"
        value={data.name}
        onChange={(e) => setData({ name: e.target.value })}
      />
    </div>
  );
}
