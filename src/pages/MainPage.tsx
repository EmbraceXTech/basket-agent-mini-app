import { ClockIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/button";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// import { Link } from "@/components/base/Link/Link";
import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import agentApi from "@/services/agent.service";
import { useDisclosure } from "@heroui/react";
import TokenModal from "@/components/TokenModal";
import { IAgent } from "@/interfaces/agent";

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

  const handleCreate = async () => {
    navigate("/create");
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectAgent, setSelectAgent] = useState<IAgent>();

  const AgentTaskComponent = useMemo(() => {
    const toggleStartPause = async (agentId: number) => {
      try {
        await agentApi.toggleStartPause(agentId);
        await refetch();
      } catch (error) {
        console.error(error);
      }
    };
    if (agents?.length === 0) {
      return (
        <div>
          <div>No agents</div>
          <Button variant="solid" onPress={() => navigate("/create")}>
            Create
          </Button>
        </div>
      );
    }

    return agents?.map((agent) => (
      <div
        key={agent.id}
        onClick={() => {
          setSelectAgent(agent);
          onOpen();
        }}
      >
        <div>Agent ID: {agent.id}</div>
        <div>Agent Name: {agent.name}</div>
        <Button variant="solid" onPress={() => navigate(`/manage/${agent.id}`)}>
          Setting
        </Button>
        <Button variant="solid" onPress={() => toggleStartPause(agent.id)}>
          {agent.isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="solid" isDisabled color="danger">
          Terminate
        </Button>
      </div>
    ));
  }, [agents, navigate, onOpen, refetch]);
  return (
    <Page back={true}>
      <div className="w-full h-screen p-4 flex flex-col">
        <Header
          title="Main Page"
          right={
            <div className="flex items-center gap-2">
              <ClockIcon className="w-6 h-6" />
            </div>
          }
        />
        <div className="flex-1">
          {isLoading ? <div>Loading...</div> : <div>{AgentTaskComponent}</div>}
        </div>
        {/* <Link to="/test/index">To Test Page</Link> */}
        <Button
          startContent={<PlusCircleIcon className="w-4 h-4" />}
          className="bg-[#FF4F29] rounded-full text-white"
          variant="solid"
          onPress={handleCreate}
        >
          Create
        </Button>
      </div>
      <TokenModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        agent={selectAgent}
      />
    </Page>
  );
}
