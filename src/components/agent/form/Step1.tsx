import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo } from "react";

import { CHAIN_LIST } from "@/constants/chain.constant";
import { TOKEN_LIST } from "@/constants/token.constant";
import useStepperStore from "@/stores/createAgent.store";

import FormHeader from "./FormHeader";

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
      data.chainId &&
      data.selectedTokens &&
      data.selectedTokens?.length > 0 &&
      data.name
        ? true
        : false;
    setCanNext(_canNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.chainId, data.selectedTokens, data.name, canNext]);

  return (
    <div className="flex flex-col gap-4">
      <FormHeader
        title="Create Agent"
        description="Create AI Agent for seamless crypto trading and Discover top strategies on BasketAgent."
      />
      <div className="flex flex-col gap-4">
        <Select
          className="w-full"
          disabledKeys={chains
            .filter((chain) => chain.chainId === (data.chainId || ""))
            .map((chain) => chain.chainId)}
          label="Choose a network"
          onChange={(e) => {
            setData({ chainId: e.target.value, selectedTokens: [] });
          }}
          renderValue={(items) => {
            const chain = chains.find(
              (chain) => chain.chainId === items[0].key
            );
            return (
              <div className="flex items-center gap-2">
                <img
                  src={chain?.imageUrl}
                  alt={chain?.chainName}
                  className="w-4 h-4"
                />
                <p>{chain?.label}</p>
              </div>
            );
          }}
        >
          {chains.map((chain) => (
            <SelectItem key={chain.chainId} value={chain.chainId}>
              <div className="flex items-center gap-2">
                <img
                  src={chain.imageUrl}
                  alt={chain.chainName}
                  className="w-4 h-4"
                />
                <p>{chain.label}</p>
              </div>
            </SelectItem>
          ))}
        </Select>
        <Select
          className="w-full"
          isDisabled={!data.chainId}
          // disabledKeys={data.selectedTokens?.map((token) => token.tokenAddress)}
          label="Choose tokens"
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            const selectedOptions = Array.from(keys);
            const selectedTokens = tokens.filter((token) =>
              selectedOptions.includes(token.tokenAddress)
            );
            setData({ selectedTokens });
          }}
          renderValue={(items) => {
            return (
              <div className="flex gap-2 overflow-x-auto">
                {items.map((item) => {
                  console.log(item);
                  const token = tokens.find(
                    (token) => token.tokenAddress === item.key
                  );
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <img
                        src={token?.imageUrl}
                        alt={token?.symbol}
                        className="w-4 h-4"
                      />
                      <p>{token?.tokenSymbol}</p>
                    </div>
                  );
                })}
              </div>
            );
          }}
        >
          {tokens.map((token) => (
            <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
              <div className="flex space-x-3">
                <img
                  className="w-6 h-6"
                  src={token.imageUrl}
                  alt={token.symbol}
                />
                <p>{token.tokenSymbol}</p>
              </div>
            </SelectItem>
          ))}
        </Select>
        <Input
          label="Agent Name"
          value={data.name}
          onChange={(e) => setData({ name: e.target.value })}
        />
      </div>
    </div>
  );
}
