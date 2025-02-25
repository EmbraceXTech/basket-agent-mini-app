import { ITokenAvailable } from "@/interfaces/token";

export default function TokenTrade({
  tokenInfo,
  action,
  amount,
}: {
  tokenInfo: ITokenAvailable | undefined;
  action: "buy" | "sell";
  amount: number;
}) {
  const unit = action === "buy" ? "USDC" : tokenInfo?.symbol?.toUpperCase();

  return (
    <div className="flex flex-row justify-between items-center cursor-pointer">
      <div className="flex flex-row items-center gap-2">
        <img
          src={tokenInfo?.logoURI}
          alt={tokenInfo?.symbol}
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <div className="text-sm">{tokenInfo?.name}</div>
          <div className="text-xs text-secondary-text">
            {action === "buy" ? "Spend " : ""}
            {Number(amount).toLocaleString(undefined, {
              maximumFractionDigits: Math.max(
                (tokenInfo?.decimals || 0) / 2,
                2
              ),
            })}{" "}
            {unit}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div className={`text-sm ${action === "buy" ? "text-green-600" : "text-red-600"}`}>
          {action === "buy" ? "Buy" : "Sell"}
        </div>
      </div>
    </div>
  );
}
