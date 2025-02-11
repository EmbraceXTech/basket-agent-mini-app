import { useParams } from "react-router-dom";
import { Tabs, Tab, Spinner } from "@heroui/react";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import ManageAsset from "@/components/manage/asset";
import ManageKnowledge from "@/components/manage/knowledge";
import ManageSettings from "@/components/manage/settings";
import { useQuery } from "@tanstack/react-query";
import agentApi from "@/services/agent.service";

export default function ManagePage() {
  const { id } = useParams();
  const { data: agentInfo, isLoading } = useQuery({
    queryKey: ["agentInfo", id],
    queryFn: () => agentApi.getAgentId(+(id || 0)),
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!id) {
    return <div>Agent ID is required</div>;
  }
  if (!agentInfo) {
    return <div>Agent not found</div>;
  }
  return (
    <Page back={true}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header title={`AI Agent Settings`} />
        <div className="flex-1">
          {isLoading ? (
            <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
              <Spinner />
              <div className="text-sm">Loading...</div>
            </div>
          ) : (
            <Tabs aria-label="Tabs radius" radius="full" fullWidth>
              <Tab key="deposit" title="Deposit">
                <ManageAsset agentInfo={agentInfo} />
              </Tab>
              <Tab key="knowledge" title="Knowledge">
                <ManageKnowledge />
              </Tab>
              <Tab key="settings" title="Settings">
                <ManageSettings />
              </Tab>
            </Tabs>
          )}
        </div>
      </div>
    </Page>
  );
}
