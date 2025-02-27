import { PlusCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";

import emptyBotIcon from "/public/empty-bot.png";
import agentApi from "@/services/agent.service";
import useStepperStore from "@/stores/createAgent.store";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import AgentCard from "@/components/agent/AgentCard";
import para from "@/core/para/config";
import toast from "react-hot-toast";
import ParaModal from "@/core/para/ParaModal";

export default function MainPage() {
  const navigate = useNavigate();
  const { reset } = useStepperStore();

  const {
    data: agents,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: () =>
      agentApi.getAgents({ includeTotalBalance: true, includeChainInfo: true }),
  });

  const handleNavigateToCreate = useCallback(() => {
    reset();
    navigate("/create");
  }, [navigate, reset]);

  const AgentList = useMemo(() => {
    const handleToggleStartPause = async (
      agentId: number,
      isRunning: boolean
    ) => {
      const { status } = await agentApi.toggleStartPause(agentId, isRunning);
      await refetch();
      return status;
    };

    if (!agents || agents.length === 0) {
      return (
        <div className="flex-1 h-full flex flex-col gap-4 items-center justify-center">
          <img
            src={emptyBotIcon}
            alt="empty agent bot"
            width={94}
            height={94}
          />
          <div className="text-sm text-secondary-text">
            You haven't created any trading bot.
          </div>
          <Button
            variant="solid"
            className="bg-secondary-background text-secondary rounded-full"
            startContent={<PlusCircleIcon className="w-4 h-4" />}
            onPress={handleNavigateToCreate}
          >
            Create Agent
          </Button>
        </div>
      );
    }

    return (
      <div className="flex-1">
        {agents &&
          agents.map((agent) => (
            <div key={agent.id} className="mb-4 shadow-sm">
              <AgentCard
                agent={agent}
                onToggleStartPause={handleToggleStartPause}
              />
            </div>
          ))}
      </div>
    );
  }, [agents, handleNavigateToCreate, refetch]);

  // Para Connector ------------------------------------------------------------
  const [isParaOpen, setIsParaOpen] = useState(false);
  const [isParaLoading, setIsParaLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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

  useEffect(() => {
    handleCheckIfAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ------------------------------------------------------------

  return (
    <Page back={false}>
      <div className="w-full min-h-screen p-4 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff4f29]/0 to-[#ff4f29]/20 to-90% h-[200px] -z-10" />
        <Header
          left={
            isConnected ? (
              <Button
                onPress={() => setIsParaOpen(true)}
                className="px-2 rounded-full"
                variant="solid"
                color="primary"
                startContent={<UserIcon className="w-4 h-4" />}
                isIconOnly
              />
            ) : (
              <Button
                isDisabled={isParaLoading}
                isLoading={isParaLoading}
                onPress={() => setIsParaOpen(true)}
                className="px-2 rounded-full"
                variant="solid"
                color="primary"
              >
                Sign In
              </Button>
            )
          }
          title="Basket Agent"
          // right={<ClockIcon className="w-6 h-6" />}
        />
        {isLoading ? (
          <div className="flex-1 flex flex-col space-y-4 items-center justify-center h-full">
            <Spinner />
            <div className="text-sm">Loading...</div>
          </div>
        ) : (
          // <div className="flex-1 h-full flex flex-col gap-4 items-center justify-center">
          AgentList
          // </div>
        )}
        <Button
          startContent={<PlusCircleIcon className="w-4 h-4" />}
          className="bg-[#FF4F29] rounded-full text-white mt-4"
          variant="solid"
          onPress={handleNavigateToCreate}
        >
          Create Agent
        </Button>
      </div>
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
