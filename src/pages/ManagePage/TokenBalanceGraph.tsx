import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Divider, Spinner } from "@heroui/react";
import { useMemo } from "react";

import tokenApi from "@/services/token.service";
import { formatUSD } from "@/utils/format.util";

import { Page } from "@/components/base/Page";
import TokenPriceChart from "@/components/manage/chart/TokenPriceChart";

export default function TokenBalanceGraph() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenAddress = queryParams.get("tokenAddress");
  const tokenSymbol = queryParams.get("tokenSymbol");

  const { data: tokenBalance, isLoading } = useQuery({
    queryKey: ["tokenBalance", id],
    queryFn: () =>
      tokenApi.getTokenBalance(id || "", {
        addUsdBalance: true,
        addTokenInfo: true,
        selectTokenSymbol: tokenSymbol
          ? [tokenSymbol.toUpperCase()]
          : undefined,
        includeTokenBase: true,
      }),
    enabled: !!id && !!tokenAddress && !!tokenSymbol,
  });

  // console.log(tokenBalance);

  const { tokenInfo, balanceUsd, balanceToken, tokenPrice } = useMemo(() => {
    return {
      tokenInfo: tokenBalance?.tokenInfo?.find(
        (token) => token.address === tokenAddress
      ),
      balanceUsd: tokenBalance?.balanceUsd?.find(
        (token) => token[0] === tokenSymbol?.toUpperCase()
      ),
      balanceToken: tokenBalance?.tokens?.find(
        (token) => token[0] === tokenSymbol?.toLowerCase()
      ),
      tokenPrice: tokenBalance?.tokenPrice?.find(
        (token) => token.token === tokenSymbol?.toUpperCase()
      ),
    };
  }, [
    tokenBalance?.tokenInfo,
    tokenBalance?.balanceUsd,
    tokenBalance?.tokens,
    tokenBalance?.tokenPrice,
    tokenAddress,
    tokenSymbol,
  ]);

  if (!id) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-screen">
        <div className="text-sm">Agent ID is required</div>
      </div>
    );
  }

  if (!tokenAddress) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-screen">
        <div className="text-sm">Token address is required</div>
      </div>
    );
  }

  if (!tokenSymbol) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center h-screen">
        <div className="text-sm">Token symbol is required</div>
      </div>
    );
  }
  return (
    <Page back={true}>
      <div className="w-full min-h-screen p-4 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
            <Spinner />
            <div className="text-sm">Loading...</div>
          </div>
        ) : tokenBalance &&
          tokenBalance.tokenInfo &&
          tokenBalance.tokenInfo.length > 0 ? (
          <div className="flex-1 mt-12">
            <img src={tokenInfo?.logoURI} alt="token" className="w-14 h-14" />
            {/* token price */}
            <div className="mt-2">
              <div className="text-xl text-[#737580]">{tokenInfo?.name}</div>
              <div className="flex justify-between">
                <p className="text-3xl font-normal">
                  {tokenPrice ? formatUSD(tokenPrice.price) : "$0.00"}
                </p>
                <div />
              </div>
            </div>
            {/* balance history graph */}
            <div className="h-[300px] w-full mt-6">
              <TokenPriceChart />
            </div>
            <div className="flex flex-row gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-[#737580] text-lg">Balance</p>
                <p className="text-2xl">{`${
                  balanceToken ? parseFloat(balanceToken[1]).toFixed(6) : "0.00"
                } ${tokenInfo?.symbol}`}</p>
              </div>
              <div className="bg-white rounded-lg p-4 flex-1">
                <p className="text-[#737580] text-lg">Value</p>
                <p className="text-2xl">{`${
                  balanceUsd ? formatUSD(balanceUsd[1]) : "$0.00"
                }`}</p>
              </div>
            </div>
            <Divider className="my-4" />
            <div className="text-lg">Tag</div>
            <div className="flex flex-row gap-4">
              {tokenInfo?.tags.map((tag, key) => (
                <div key={key} className="bg-white rounded-lg p-2">
                  <p className="text-[#737580] text-sm">{tag}</p>
                </div>
              ))}
            </div>
            <Divider className="my-4" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
            <div className="text-sm">Token balance not found</div>
          </div>
        )}
      </div>
    </Page>
  );
}
