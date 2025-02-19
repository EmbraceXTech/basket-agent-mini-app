import { useParams } from "react-router-dom";
import { Tabs, Tab, Spinner, Button } from "@heroui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  BookOpenIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  TrashIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

import agentApi from "@/services/agent.service";
import { IKnowledge } from "@/interfaces/knowledge";
import { IAgentRequest } from "@/interfaces/agent";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
// import ManageAsset from "@/components/manage/Asset";
import ManageWallet from "@/components/manage/Wallet";
import ManageKnowledge from "@/components/manage/Knowledge";
import ManageSettings from "@/components/manage/Settings";
import TerminateModal from "@/components/agent/modal/TerminateModal";
import ManageLogs from "@/components/manage/Logs";

export default function ManagePage() {
  const { id } = useParams();
  const [tab, setTab] = useState("deposit");
  const { data: agentInfo, isLoading } = useQuery({
    queryKey: ["agentInfo", id],
    queryFn: () => agentApi.getAgentId(+(id || 0), { includeChainInfo: true }),
  });
  const [knowledgeBase, setKnowledgeBase] = useState<IKnowledge[]>(
    agentInfo?.knowledge ?? []
  );
  const [settings, setSettings] = useState<Partial<IAgentRequest>>({});
  const handleSaveKnowledge = () => {
    toast.promise(
      agentApi.updateAgent(+(id || 0), {
        knowledges: knowledgeBase.map((knowledge) => ({
          name: knowledge.name,
          content: knowledge.content,
        })),
      }),
      {
        loading: "Saving...",
        success: "Knowledge saved",
        error: "Failed to save knowledge",
      }
    );
  };
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

  const handleSaveSettings = () => {
    console.log("settings", settings);
    toast.promise(agentApi.updateAgent(+(id || 0), settings), {
      loading: "Saving...",
      success: "Settings saved",
      error: "Failed to save settings",
    });
  };
  if (!id) {
    return (
      <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
        <div className="text-sm">Agent ID is required</div>
      </div>
    );
  }
  return (
    <Page back={true}>
      <div className="w-full min-h-screen p-4 pb-6 flex flex-col">
        <Header
          title={agentInfo?.name || "AI Agent Settings"}
          right={
            <Button
              variant="light"
              onPress={() => setIsTerminateModalOpen(true)}
              startContent={
                <TrashIcon
                  className="w-5 h-5 text-secondary-icon"
                  strokeWidth={2}
                />
              }
              isIconOnly
            />
          }
        />
        <>
          {isLoading ? (
            <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
              <Spinner />
              <div className="text-sm">Loading...</div>
            </div>
          ) : agentInfo ? (
            <Tabs
              aria-label="Tabs radius"
              radius="full"
              variant="underlined"
              color="primary"
              fullWidth
              selectedKey={tab}
              onSelectionChange={(key: string | number) => setTab(String(key))}
              classNames={{
                tab: "h-fit",
              }}
            >
              <Tab
                key="wallet"
                title={
                  <div className="flex flex-col items-center space-y-1">
                    <WalletIcon className="w-6 h-6" />
                    <p className="text-xs font-medium">Wallet</p>
                  </div>
                }
              >
                <div className="my-6">
                  <ManageWallet agentInfo={agentInfo} />
                </div>
              </Tab>
              <Tab
                key="logs"
                title={
                  <div className="flex flex-col items-center space-y-1">
                    <DocumentTextIcon className="w-6 h-6" />
                    <p className="text-xs font-medium">Logs</p>
                  </div>
                }
              >
                <ManageLogs agentInfo={agentInfo} />
              </Tab>
              <Tab
                key="knowledge"
                title={
                  <div className="flex flex-col items-center space-y-1">
                    <BookOpenIcon className="w-6 h-6" />
                    <p className="text-xs font-medium">Knowledge</p>
                  </div>
                }
              >
                <ManageKnowledge
                  agentInfo={agentInfo}
                  setKnowledgeBase={setKnowledgeBase}
                />
              </Tab>
              <Tab
                key="settings"
                title={
                  <div className="flex flex-col items-center space-y-1">
                    <Cog6ToothIcon className="w-6 h-6" />
                    <p className="text-xs font-medium">Settings</p>
                  </div>
                }
              >
                <ManageSettings
                  agentInfo={agentInfo}
                  setSettings={(value) => setSettings(value)}
                />
              </Tab>
            </Tabs>
          ) : (
            <div>Agent not found</div>
          )}
        </>
        {(tab === "knowledge" || tab === "settings") && (
          <div className="flex-1" />
        )}
        {(tab === "knowledge" || tab === "settings") && (
          <Button
            className="bg-[#FF4F29] rounded-full text-white p-4 w-full"
            variant="solid"
            onPress={
              tab === "knowledge" ? handleSaveKnowledge : handleSaveSettings
            }
          >
            Save
          </Button>
        )}
      </div>
      <TerminateModal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        onOpenChange={() => setIsTerminateModalOpen(!isTerminateModalOpen)}
        agentId={+id}
      />
    </Page>
  );
}
