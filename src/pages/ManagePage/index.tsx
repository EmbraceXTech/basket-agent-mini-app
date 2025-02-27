import { useNavigate, useParams } from "react-router-dom";
import { Tabs, Tab, Spinner, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  BookOpenIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  TrashIcon,
  UserIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";

import agentApi from "@/services/agent.service";
import { IUpdateKnowledgeRequest } from "@/interfaces/knowledge";
import { IAgentRequest } from "@/interfaces/agent";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
// import ManageAsset from "@/components/manage/Asset";
import ManageWallet from "@/components/manage/Wallet";
import ManageKnowledge from "@/components/manage/Knowledge";
import ManageSettings from "@/components/manage/Settings";
import TerminateModal from "@/components/agent/modal/TerminateModal";
import ManageLogs from "@/components/manage/Logs";
import ParaModal from "@/core/para/ParaModal";
import para from "@/core/para/config";
import walletService from "@/services/wallet.service";
import { OAuthMethod } from "@getpara/react-sdk";

export default function ManagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("wallet");
  const [isSaving, setIsSaving] = useState(false);
  const {
    data: agentInfo,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["agentInfo", id],
    queryFn: () => agentApi.getAgentId(+(id || 0), { includeChainInfo: true }),
  });
  const [knowledgeBase, setKnowledgeBase] = useState<IUpdateKnowledgeRequest[]>(
    agentInfo?.knowledge ?? []
  );
  const [removeKnowledgeIds, setRemoveKnowledgeIds] = useState<number[]>([]);
  const [settings, setSettings] = useState<Partial<IAgentRequest>>({});
  const handleSaveKnowledge = () => {
    toast.promise(
      async () => {
        setIsSaving(true);
        try {
          await agentApi.updateKnowledge(
            +(id || 0),
            removeKnowledgeIds,
            knowledgeBase
          );
          refetch();
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Failed to save knowledge");
        } finally {
          setIsSaving(false);
        }
      },
      {
        loading: "Saving...",
        success: "Knowledge saved",
        error: "Failed to save knowledge",
      }
    );
  };
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

  const handleSaveSettings = () => {
    toast.promise(
      async () => {
        setIsSaving(true);
        try {
          await agentApi.updateAgent(+(id || 0), settings);
          refetch();
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Failed to save settings");
        } finally {
          setIsSaving(false);
        }
      },
      {
        loading: "Saving...",
        success: "Settings saved",
        error: "Failed to save settings",
      }
    );
  };

  // Para Connector ------------------------------------------------------------
  const [isParaOpen, setIsParaOpen] = useState(false);
  const [isParaLoading, setIsParaLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleCheckIfAuthenticated = async () => {
    setIsParaLoading(true);
    try {
      const isAuthenticated = await para.isFullyLoggedIn();
      if (isAuthenticated) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
      setIsParaLoading(isAuthenticated);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "An error occurred during authentication");
      } else {
        toast.error("An unknown error occurred during authentication");
      }
    }
    setIsParaLoading(false);
  };

  const handleClaimWallet = async () => {
    if (!id) {
      toast.error("Agent ID is required");
      return;
    }

    if (!isConnected) {
      toast.error("Please sign in to claim your wallet");
      return;
    }

    setIsClaiming(true);

    const isEmail = para.isEmail;
    const isTelegram = para.isTelegram;
    const isPhone = para.isPhone;

    const identifier = isEmail
      ? para.getEmail()
      : isTelegram
      ? para.telegramUserId
      : isPhone
      ? para.phone
      : null;

    const identifierType = isEmail
      ? "EMAIL"
      : isTelegram
      ? "TELEGRAM"
      : isPhone
      ? "PHONE"
      : "CUSTOM_ID";

    if (!identifier) {
      toast.error("No identifier found");
      setIsParaLoading(false);
      setIsParaOpen(false);
      return;
    }

    try {
      await walletService.claimWallet(id, {
        userId: para.getUserId() || "",
        identifier: identifier,
        identifierType: identifierType as
          | OAuthMethod.TWITTER
          | OAuthMethod.DISCORD
          | OAuthMethod.TELEGRAM
          | "EMAIL"
          | "PHONE"
          | "CUSTOM_ID",
      });
      toast.success("Wallet claimed");
      setIsParaLoading(false);
      setIsParaOpen(false);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    handleCheckIfAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ------------------------------------------------------------
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
          left={
            isConnected ? (
              <div className="flex gap-1">
                <Button
                  onPress={() => setIsParaOpen(true)}
                  className="px-2 rounded-full"
                  variant="solid"
                  color="primary"
                  startContent={<UserIcon className="w-4 h-4" />}
                  isIconOnly
                />
                <Button
                  isDisabled={isClaiming}
                  isLoading={isClaiming}
                  onPress={handleClaimWallet}
                  className="px-2 rounded-full"
                  variant="solid"
                  color="primary"
                >
                  Claim
                </Button>
              </div>
            ) : (
              <Button
                isDisabled={isParaLoading}
                isLoading={isParaLoading}
                onPress={() => setIsParaOpen(true)}
                className="px-2 rounded-full"
                variant="solid"
                color="primary"
              >
                Sign in to claim
              </Button>
            )
          }
          right={
            <>
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
            </>
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
                  setRemoveKnowledgeIds={(ids: number[]) =>
                    setRemoveKnowledgeIds((prev) => [...prev, ...ids])
                  }
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
            isLoading={isSaving}
            isDisabled={isSaving}
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
      <ParaModal
        isOpen={isParaOpen}
        setIsOpen={(isOpen) => {
          handleCheckIfAuthenticated();
          setIsParaOpen(isOpen);
        }}
      />
    </Page>
  );
}
