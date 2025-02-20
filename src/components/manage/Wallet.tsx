import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { IAgentInfo } from "@/interfaces/agent";
import tokenApi from "@/services/token.service";
import TokenCard from "../assets/TokenCard";
import { Button, Spinner } from "@heroui/react";
import { formatUSD } from "@/utils/format.util";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

export default function Wallet({ agentInfo }: { agentInfo: IAgentInfo }) {
  const navigate = useNavigate();
  const { data: tokenBalances, isLoading } = useQuery({
    queryKey: ["tokenBalances", agentInfo.id],
    queryFn: () =>
      tokenApi.getTokenBalance(agentInfo.id.toString() || "", {
        addUsdBalance: true,
        addTokenInfo: true,
        includeTokenBase: true,
        chainId: agentInfo.chainId,
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

    console.log(tokenBalances);

    return (
      <div className="flex flex-col space-y-4">
        {tokenBalances.tokens.map((token, key) => {
          const tokenInfo = tokenBalances.tokenInfo?.find(
            (t) => t.symbol.toLowerCase() === token[0].toLowerCase()
          );
          const balanceUsd = tokenBalances.balanceUsd?.find(
            (t) => t[0].toLowerCase() === token[0].toLowerCase()
          ) ?? [token[0], 0];
          if (!tokenInfo) {
            return null;
          }
          return (
            <TokenCard
              key={key}
              agentId={agentInfo.id}
              token={token}
              tokenInfo={tokenInfo}
              balanceUsd={balanceUsd}
            />
          );
        })}
      </div>
    );
  }, [agentInfo.id, tokenBalances]);
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="text-center text-3xl">
          {tokenBalances?.balance
            ? formatUSD(tokenBalances?.balance ?? 0)
            : "$0.00"}
        </div>
      )}
      <div className="flex justify-between items-center px-3 space-x-3 mb-4 mt-6">
        <Button
          variant="solid"
          size="lg"
          className="w-full rounded-full text-white bg-primary"
          startContent={<ArrowDownIcon className="w-5 h-5 stroke-white" />}
          onPress={() => navigate(`/manage/${agentInfo.id}/deposit`)}
        >
          Deposit
        </Button>
        <Button
          variant="solid"
          size="lg"
          className="w-full rounded-full text-[#292C33] bg-[#F8F9FB]"
          startContent={<ArrowUpIcon className="w-5 h-5 stroke-[#292C33]" />}
        >
          Withdraw
        </Button>
      </div>
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
  );
}
