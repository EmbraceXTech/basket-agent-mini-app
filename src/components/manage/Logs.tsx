import {
  useInfiniteQuery,
  useQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { Spinner } from "@heroui/react";
import { isToday, format } from "date-fns";
import { useEffect, useRef } from "react";
import { IAgentInfo } from "@/interfaces/agent";
import { IAgentLog, IAgentLogResponse } from "@/interfaces/agentLog";
import agentLogService from "@/services/agentLog.service";
import tokenService from "@/services/token.service";
import { LOG_TYPE } from "@/constants/log.constant";
import LogTradePlan from "./manage-log/LogTradePlan";
import LogTradeError from "./manage-log/LogTradeError";
import LogDeposit from "./manage-log/logDeposit";
import LogWithdraw from "./manage-log/LogWithdraw";

type GroupedLogs = {
  [date: string]: IAgentLog[];
};

export default function ManageLogs({ agentInfo }: { agentInfo: IAgentInfo }) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery<
    IAgentLogResponse,
    Error,
    InfiniteData<IAgentLogResponse, number>,
    (string | number)[],
    number
  >({
    queryKey: ["agentLogs", agentInfo.id],
    queryFn: ({ pageParam = 1 }) =>
      agentLogService.getAll({
        agentId: agentInfo.id,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage: IAgentLogResponse, allPages) => {
      if (lastPage.meta.currentPage < lastPage.meta.totalPages) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const { data: tokenInfo } = useQuery({
    queryKey: ["tokenInfo", agentInfo.chainId],
    queryFn: () => tokenService.getTokenAvailable(agentInfo.chainId, true),
    enabled: !!agentInfo.chainId,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, data?.pages.length]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full pt-10">
        <Spinner />
        <div className="text-sm">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
        <div className="text-sm mt-10 text-red-500">Error loading logs</div>
      </div>
    );
  }

  const hasLogs = data?.pages?.some((page) => page.data?.length > 0);

  if (!hasLogs || !data) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
        <div className="text-sm mt-10 text-gray-500">No logs found</div>
      </div>
    );
  }

  const groupedLogs = data.pages.reduce<GroupedLogs>((acc, page) => {
    page.data.forEach((log) => {
      const date = new Date(log.createdAt);
      const dateString = isToday(date) ? "Today" : format(date, "MMM dd, yyyy");

      if (!acc[dateString]) {
        acc[dateString] = [];
      }
      acc[dateString].push(log);
    });
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 flex flex-col space-y-6">
        {Object.entries(groupedLogs).map(([dateString, logs]) => (
          <div key={dateString}>
            <div className="text-lg text-[#737580] mb-3">{dateString}</div>
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
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
      <div
        ref={observerTarget}
        className="h-20 w-full"
        style={{ visibility: hasNextPage ? "visible" : "hidden" }}
      />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
