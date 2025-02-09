import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import agentApi from "@/services/agent.service";
import AgentCard from "@/components/agent/AgentCard";

const PlusCircleIconComponent = PlusCircleIcon as FC;

export default function MainPage() {
  const navigate = useNavigate();

  const {
    data: agents,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: () => agentApi.getAgents(),
  });

  const handleCreate = () => {
    navigate("/create");
  };

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
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-sm">Create your first Basket Agent</div>
          <Button
            variant="solid"
            className="bg-[#FF4F29] text-white rounded-full"
            startContent={<PlusCircleIconComponent className="w-4 h-4" />}
            onPress={handleCreate}
          >
            Create Agent
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
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
  }, [agents, navigate, refetch]);

  return (
    <Page back={false}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header title="Basket Agent" />
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              Loading...
            </div>
          ) : (
            AgentList
          )}
        </div>
        {agents?.length > 0 && (
          <Button
            startContent={<PlusCircleIconComponent className="w-4 h-4" />}
            className="bg-[#FF4F29] rounded-full text-white mt-4"
            variant="solid"
            onPress={handleCreate}
          >
            Create Agent
          </Button>
        )}
      </div>
    </Page>
  );
}
