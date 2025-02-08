import { Button } from "@heroui/react";
import { useParams } from "react-router-dom";
import { Tabs, Tab } from "@heroui/react";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import ManageAsset from "@/components/manage/asset";
import ManageKnowledge from "@/components/manage/knowledge";
import ManageSettings from "@/components/manage/settings";
import { useQuery } from "@tanstack/react-query";
import agentApi from "@/services/agent.service";

export default function ManagePage() {
  const { id } = useParams();
  console.log(id);
  const { data: agent, isLoading } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => agentApi.getAgentId(id || ""),
  });
  if (!agent) {
    return <div>Agent not found</div>;
  }
  return (
    <Page back={true}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header title={`Agent ID: ${id}`} />
        <div className="flex-1">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Tabs aria-label="Tabs radius" radius="full" fullWidth>
              <Tab key="deposit" title="Deposit">
                <ManageAsset agent={agent} />
              </Tab>
              <Tab key="manage-knowledge" title="Manage Knowledge">
                <ManageKnowledge />
              </Tab>
              <Tab key="settings" title="Settings">
                <ManageSettings />
              </Tab>
            </Tabs>
          )}
        </div>
        <Button className="bg-blue-500 rounded-full text-white" variant="solid">
          Start Now
        </Button>
      </div>
    </Page>
  );
}
