import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/react";

import emptyBotIcon from "/public/empty-bot.png";
import agentApi from "@/services/agent.service";
import useStepperStore from "@/stores/createAgent.store";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import AgentCard from "@/components/agent/AgentCard";

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
            <AgentCard
              key={agent.id}
              agent={agent}
              onToggleStartPause={handleToggleStartPause}
            />
          ))}
      </div>
    );
  }, [agents, handleNavigateToCreate, refetch]);

  return (
    <Page back={false}>
      <div className="w-full min-h-screen p-4 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff4f29]/0 to-[#ff4f29]/20 to-90% h-[200px] -z-10" />
        <Header
          title="Basket Agent"
          right={<ClockIcon className="w-6 h-6" />}
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
    </Page>
  );
}
