import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";

import tokenApi from "@/services/token.service";
import { formatUSD } from "@/utils/format.util";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import TokenCard from "@/components/assets/TokenCard";
import { useParams } from "react-router-dom";

export default function AssetPage() {
  const { id } = useParams();
  const { data: tokenBalances, isLoading } = useQuery({
    queryKey: ["tokenBalances", id],
    queryFn: () =>
      tokenApi.getTokenBalance(id || "", {
        addUsdBalance: true,
        addTokenInfo: true,
      }),
  });

  const TokenList = useMemo(() => {
    if (!tokenBalances || tokenBalances.tokens.length === 0) {
      return (
        <div className="text-sm text-center flex-1 flex justify-center items-center">
          Token not found
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-4">
        {tokenBalances.tokens.map((token, key) => {
          const tokenInfo = tokenBalances.tokenInfo?.[key];
          const balanceUsd = tokenBalances.balanceUsd?.[key] ?? [token[0], 0];
          if (!tokenInfo) {
            return null;
          }
          return (
            <TokenCard
              key={key}
              token={token}
              tokenInfo={tokenInfo}
              balanceUsd={balanceUsd}
              agentId={Number(id)}
            />
          );
        })}
      </div>
    );
  }, [tokenBalances, id]);

  return (
    <Page back={true}>
      <div className="w-full min-h-screen p-4 flex flex-col">
        <Header title="My Assets" />
        <p className="text-center text-xs text-secondary-text">Total Balance</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            <div className="text-center text-3xl">
              {formatUSD(tokenBalances?.balance ?? 0)}
            </div>
          </div>
        )}
        <div className="font-medium mt-6 mb-3">Tokens</div>
        {isLoading ? (
          <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
            <Spinner />
            <div className="text-sm">Loading...</div>
          </div>
        ) : (
          TokenList
        )}
      </div>
    </Page>
  );
}
