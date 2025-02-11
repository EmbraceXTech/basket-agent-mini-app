import { ITokenBalance } from "@/interfaces/token";
import { TOKEN_LIST } from "@/constants/token.constant";
import { DEFAULT_CHAIN_ID } from "@/constants/chain.constant";
import { formatUSD } from "@/utils/format.util";
import { useMemo } from "react";

export default function TokenCard({ token }: { token: ITokenBalance }) {
  const tokenInfo = TOKEN_LIST[DEFAULT_CHAIN_ID].find(
    (t) => t.symbol === token.tokenSymbol
  );
  // true -> +, false -> -
  const getPnlStatus = useMemo(() => {
    return token.pnl === undefined || token.pnl === null || token.pnl >= 0;
  }, [token.pnl]);
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row items-center gap-2">
        <img
          src={tokenInfo?.imageUrl}
          alt={tokenInfo?.symbol}
          className="w-14 h-14"
        />
        <div className="flex flex-col">
          <div className="text-sm">{token.tokenSymbol}</div>
          <div className="text-xs text-secondary-text">
            {token.balance} {token.tokenSymbol}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div>{formatUSD(token.balanceUsd) ?? 0.0}</div>
        <div
          className={`text-sm ${
            getPnlStatus ? "text-green-600" : "text-red-500"
          }`}
        >
          {getPnlStatus ? "+" : "-"}
          {formatUSD(token.pnl) ?? 0.0}%
        </div>
      </div>
    </div>
  );
}
