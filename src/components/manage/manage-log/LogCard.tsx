import { IAgentLog } from "@/interfaces/agentLog";
import { ITokenAvailable } from "@/interfaces/token";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

export default function LogCard({
  log,
  chainName,
  tokenInfo,
}: {
  log: IAgentLog;
  chainName: string;
  tokenInfo?: ITokenAvailable;
}) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-[#F9FAFC] rounded-2xl">
      <div className="flex space-x-3 items-center">
        <div className="relative">
          <img
            src={tokenInfo?.logoURI}
            alt={tokenInfo?.symbol}
            className="w-12 h-12 rounded-full"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full w-fit h-fit p-1 ring-2 ring-white">
            {log.action === "buy" ? <ArrowDownIcon className="w-4 h-4 text-white" /> : <ArrowUpIcon className="w-4 h-4 text-white" />}
          </div>
        </div>
        <div>
          <p className="font-medium text-lg">
            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
          </p>
          <p className="text-gray-500">{chainName}</p>
        </div>
      </div>
      <div>
        {`${log.action === "buy" ? "+" : "-"}${log.amount.toFixed(2)} ${
          tokenInfo?.symbol ?? ""
        }`}
      </div>
    </div>
  );
}
