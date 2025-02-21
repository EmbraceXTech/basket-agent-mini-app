import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";

import agentApi from "@/services/agent.service";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import WithdrawAsset from "@/components/manage/Withdraw";

export default function WithdrawPage() {
  const { id } = useParams();
  const { data: agentInfo, isLoading } = useQuery({
    queryKey: ["agentInfo", id],
    queryFn: () => agentApi.getAgentId(+(id || 0), { includeChainInfo: true }),
  });

  if (!id) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
        <div className="text-sm">Agent ID is required</div>
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
        ) : agentInfo ? (
          <div className="flex-1">
            <Header title={agentInfo?.name || "ETH AI Agent Trading"} />
            <div className="mt-12">
              <WithdrawAsset agentInfo={agentInfo} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
            <div className="text-sm">Agent not found</div>
          </div>
        )}
      </div>
    </Page>
  );
}
