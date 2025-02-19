import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ITokenAvailable } from "@/interfaces/token";
import { formatUSD } from "@/utils/format.util";

export default function TokenCard({
  token,
  tokenInfo,
  balanceUsd,
  agentId,
}: {
  token: [string, string];
  tokenInfo: ITokenAvailable;
  balanceUsd: [string, number];
  agentId: number;
}) {
  // true -> +, false -> -
  const pnl = 0;
  const getPnlStatus = useMemo(() => {
    // return token.pnl === undefined || token.pnl === null || token.pnl >= 0;
    return true;
    // }, [token.pnl]);
  }, []);
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-row justify-between items-center cursor-pointer"
      onClick={() =>
        navigate(
          `/manage/${agentId}/token-balance-graph?tokenAddress=${tokenInfo.address}&tokenSymbol=${token[0]}`
        )
      }
    >
      <div className="flex flex-row items-center gap-2">
        <img
          src={tokenInfo?.logoURI}
          alt={tokenInfo?.symbol}
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <div className="text-sm">{tokenInfo?.name}</div>
          <div className="text-xs text-secondary-text">
            {token[1]} {token[0]?.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div>{formatUSD(balanceUsd[1]) ?? 0.0}</div>
        <div
          className={`text-sm ${
            getPnlStatus ? "text-green-600" : "text-red-500"
          }`}
        >
          {getPnlStatus ? "+" : "-"}
          {pnl ?? 0.0}%
        </div>
      </div>
    </div>
  );
}
