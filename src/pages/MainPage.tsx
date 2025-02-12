import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import agentApi from "@/services/agent.service";
import AgentCard from "@/components/agent/AgentCard";
import { Spinner } from "@heroui/react";
import useStepperStore from "@/stores/createAgent.store";

export default function MainPage() {
  const navigate = useNavigate();
  const { reset } = useStepperStore();

  const {
    data: agents,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentApi.getAgents({ includeTotalBalance: true, includeChainInfo: true }),
  });

  const handleNavigateToCreate = useCallback(() => {
    reset();
    navigate("/create");
  }, [navigate, reset]);

  const AgentList = useMemo(() => {
    const toggleStartPause = async (agentId: number) => {
      try {
        await agentApi.toggleStartPause(agentId);
        await refetch();
      } catch (error) {
        console.error(error);
      }
    };

    if (!agents || agents.length === 0) {
      return (
        <div className="flex-1 h-full flex flex-col gap-4 items-center justify-center">
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
              onToggleStartPause={toggleStartPause}
            />
          ))}
      </div>
    );
  }, [agents, handleNavigateToCreate, refetch]);

  return (
    <Page back={false}>
      <div className="w-full min-h-screen p-4 flex flex-col">
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
