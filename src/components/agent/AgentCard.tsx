import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { PauseIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";

import { formatUSD, formatPercent } from "@/utils/format.util";
import type { IAgent } from "@/interfaces/agent.d";
import TerminateModal from "./modal/TerminateModal";

interface AgentCardProps {
  agent: IAgent;
  onToggleStartPause: (agentId: number) => Promise<void>;
}

export default function AgentCard({
  agent,
  onToggleStartPause,
}: AgentCardProps) {
  const navigate = useNavigate();
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

  // true -> +, false -> -
  const getPnlStatus = useMemo(() => {
    return agent.pnl === undefined || agent.pnl === null || agent.pnl >= 0;
  }, [agent.pnl]);

  console.log(agent);

  return (
    <div
      className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col space-y-6 w-full"
      // onClick={() => navigate(`/assets/${agent.id}`)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {agent.chainId ? (
            <img
              src={agent.chainInfo?.iconUrl}
              alt={agent.chainInfo?.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center">
              {agent.chainInfo?.name}
            </div>
          )}
          <div>
            <div
              className="font-medium text-lg cursor-pointer hover:underline hover:text-primary-400"
              onClick={() => navigate(`/assets/${agent.id}`)}
            >
              {agent.name}
            </div>
            <p className="text-xs text-gray-500">
              Created at: {new Date(agent.createdAt).toLocaleString()}
            </p>
            <div></div>
          </div>
        </div>
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
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm text-gray-500">Total Balance</div>
        <div className="text-sm text-gray-500">Current Profit</div>
        <div className="text-xl">
          {agent?.totalBalance
            ? `${formatUSD(agent.totalBalance)} USD`
            : "$0.00"}
        </div>
        <div
          className={`text-xl ${
            getPnlStatus ? "text-green-600" : "text-red-500"
          }`}
        >
          {`${getPnlStatus ? "+" : "-"}${agent.pnl ?? "0.00"}(${
            getPnlStatus ? "+" : "-"
          }${formatPercent(agent.pnl)}%)`}
        </div>
      </div>
      <div className="flex space-x-3">
        <Button
          variant="flat"
          onPress={() => onToggleStartPause(agent.id)}
          className="rounded-full font-semibold flex-1 bg-secondary-background text-secondary"
          startContent={
            agent.isRunning ? (
              <PauseIcon className="w-5 h-5" strokeWidth={4} />
            ) : (
              <PlayIcon className="w-5 h-5" strokeWidth={4} />
            )
          }
        >
          {agent.isRunning ? "Pause" : "Start"}
        </Button>
        <Button
          variant="flat"
          onPress={() => navigate(`/manage/${agent.id}`)}
          className="rounded-full font-semibold flex-1 bg-secondary-background text-secondary"
          startContent={<Cog6ToothIcon className="w-5 h-5" />}
        >
          Settings
        </Button>
      </div>
      <TerminateModal
        isOpen={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        onOpenChange={() => setIsTerminateModalOpen(!isTerminateModalOpen)}
        agentId={agent.id}
      />
    </div>
  );
}
