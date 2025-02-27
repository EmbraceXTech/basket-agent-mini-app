import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import useStepperStore from "@/stores/createAgent.store";
import chainApi from "@/services/chain.service";
import tokenApi from "@/services/token.service";
import { IChain } from "@/interfaces/chain";

import FormHeader from "./FormHeader";
import { ITokenAvailable } from "@/interfaces/token";

export default function Step1() {
  const { data, setData, setCanNext, canNext } = useStepperStore();

  const [chains, setChains] = useState<IChain[]>([]);
  const [isLoadingChains, setIsLoadingChains] = useState(true);

  useEffect(() => {
    const fetchChains = async () => {
      try {
        const data = await chainApi.getChainAvailable();
        setChains(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingChains(false);
      }
    };

    fetchChains();
  }, []);

  const [tokens, setTokens] = useState<ITokenAvailable[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  useEffect(() => {
    if (!data.chainId) return;

    const fetchTokens = async () => {
      setIsLoadingTokens(true);
      try {
        const tokens = await tokenApi.getTokenAvailable(data.chainId || "");
        const filteredStableCoinTokens = tokens.filter(
          (token) => !["USDC", "USDT", "DAI"].includes(token.symbol.toUpperCase())
        );
        setTokens(filteredStableCoinTokens);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingTokens(false);
      }
    };

    fetchTokens();
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
            ?.filter((chain) => chain.chainId === +(data.chainId || -1))
            .map((chain) => chain.chainId.toString())}
          label="Choose a network"
          onChange={(e) => {
            setData({ chainId: e.target.value, selectedTokens: [] });
          }}
          renderValue={(items) => {
            const chain = chains?.find(
              (chain) => chain.chainId.toString() === items[0].key?.toString()
            );
            return (
              <div className="flex items-center gap-2">
                <img
                  src={chain?.iconUrl}
                  alt={chain?.name}
                  className="w-4 h-4"
                />
                <p>{chain?.name}</p>
              </div>
            );
          }}
          isLoading={isLoadingChains}
        >
          {chains?.map((chain) => (
            <SelectItem key={chain.chainId} value={chain.chainId}>
              <div className="flex items-center gap-2">
                <img src={chain.iconUrl} alt={chain.name} className="w-4 h-4" />
                <p>{chain.name}</p>
              </div>
            </SelectItem>
          )) || []}
        </Select>
        <Select
          className="w-full"
          isDisabled={!data.chainId}
          // disabledKeys={data.selectedTokens?.map((token) => token.tokenAddress)}
          label="Choose tokens"
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            const selectedOptions = Array.from(keys);
            const selectedTokens = tokens
              ?.filter((token) => selectedOptions.includes(token.address))
              .map((token) => ({
                tokenSymbol: token.symbol,
                tokenAddress: token.address,
              }));
            setData({ selectedTokens });
          }}
          renderValue={(items) => {
            return (
              <div className="flex gap-2 overflow-x-auto">
                {items.map((item) => {
                  const token = tokens?.find(
                    (token) => token.address === item.key
                  );
                  return (
                    <div key={item.key} className="flex items-center gap-2">
                      <img
                        src={token?.logoURI}
                        alt={token?.symbol}
                        className="w-4 h-4"
                      />
                      <p>{token?.symbol}</p>
                    </div>
                  );
                })}
              </div>
            );
          }}
          isLoading={isLoadingTokens}
        >
          {tokens?.map((token) => (
            <SelectItem key={token.address} value={token.address}>
              <div className="flex space-x-3">
                <img
                  className="w-6 h-6"
                  src={token.logoURI}
                  alt={token.symbol}
                />
                <p>{token.symbol}</p>
              </div>
            </SelectItem>
          )) || []}
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
