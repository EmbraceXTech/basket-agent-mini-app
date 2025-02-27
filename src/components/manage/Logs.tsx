import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import { isToday } from "date-fns";

import { IAgentInfo } from "@/interfaces/agent";
import agentLogService from "@/services/agentLog.service";

import LogCard from "./manage-log/LogCard";
import tokenService from "@/services/token.service";
import { LOG_TYPE } from "@/constants/log.constant";
import LogTradePlan from "./manage-log/LogTradePlan";
import LogTradeError from "./manage-log/LogTradeError";
import LogDeposit from "./manage-log/logDeposit";
import LogWithdraw from "./manage-log/LogWithdraw";

export default function ManageLogs({ agentInfo }: { agentInfo: IAgentInfo }) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["agentLogs", agentInfo.id],
    queryFn: () => agentLogService.getAll(agentInfo.id),
  });

  const { data: tokenInfo } = useQuery({
    queryKey: ["tokenInfo", agentInfo.chainId],
    queryFn: () => tokenService.getTokenAvailable(agentInfo.chainId, true),
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
                if (log.logType === LOG_TYPE.TRADE_PLAN) {
                  return (
                    <LogTradePlan
                      key={log.id}
                      logData={log.content}
                      tokenInfo={tokenInfo}
                    />
                  );
                } else if (log.logType === LOG_TYPE.TRADE_ERROR) {
                  return <LogTradeError key={log.id} logData={log.content} />;
                } else if (log.logType === LOG_TYPE.DEPOSIT) {
                  return (
                    <LogDeposit
                      key={log.id}
                      logData={log.content}
                      tokenInfo={tokenInfo}
                    />
                  );
                } else if (log.logType === LOG_TYPE.WITHDRAWAL) {
                  return (
                    <LogWithdraw
                      key={log.id}
                      logData={log.content}
                      tokenInfo={tokenInfo}
                    />
                  );
                }
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
