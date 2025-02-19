import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import { isToday } from "date-fns";

import { IAgentInfo } from "@/interfaces/agent";
import agentLogService from "@/services/agentLog.service";

import LogCard from "./manage-log/LogCard";
import tokenService from "@/services/token.service";

export default function ManageLogs({ agentInfo }: { agentInfo: IAgentInfo }) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["agentLogs", agentInfo.id],
    queryFn: () => agentLogService.getAll(agentInfo.id),
  });

  const { data: tokenInfo } = useQuery({
    queryKey: ["tokenInfo", agentInfo.chainId],
    queryFn: () => tokenService.getTokenAvailable(agentInfo.chainId),
    enabled: !!agentInfo.chainId,
  });

  return (
    <>
      {isLoading ? (
        <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
          <Spinner />
          <div className="text-sm">Loading...</div>
        </div>
      ) : logs && Object.keys(logs).length > 0 ? (
        Object.entries(logs).map(([date, logs]) => (
          <div key={date}>
            <div className="text-lg text-[#737580] my-2">
              {isToday(new Date(date)) ? "Today" : date}
            </div>
            <div className="flex flex-col space-y-3">
              {logs.map((log) => {
                const _tokenInfo = tokenInfo?.find(
                  (token) => token.address === log.tokenAddr
                );
                return (
                  <LogCard
                    key={log.id}
                    log={log}
                    chainName={agentInfo.chainInfo?.name || ""}
                    tokenInfo={_tokenInfo}
                  />
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
          <div className="text-sm">No logs found</div>
        </div>
      )}
    </>
  );
}
