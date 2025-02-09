import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { formatUSD, formatPercent } from "@/utils/format.util";
import { IAgent } from "@/interfaces/agent";
import {
  PlayIcon,
  PauseIcon,
  WalletIcon,
} from "@heroicons/react/24/solid";
import type { FC } from "react";

const PlayIconComponent = PlayIcon as FC;
const PauseIconComponent = PauseIcon as FC;
const WalletIconComponent = WalletIcon as FC;

interface AgentCardProps {
  agent: IAgent;
  onToggleStartPause: (agentId: number) => Promise<void>;
}

export default function AgentCard({
  agent,
  onToggleStartPause,
}: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg p-4 shadow"
      //   onClick={() => navigate(`/manage/${agent.id}`)}
    >
      <div className="flex justify-between items-center">
        <div className="font-medium text-lg cursor-pointer hover:underline hover:text-primary-400" onClick={() => navigate(`/manage/${agent.id}`)}>{agent.name}</div>
        <Button
          variant="light"
          color={agent.isRunning ? "success" : "warning"}
          onClick={(e: React.MouseEvent) => {
            onToggleStartPause(agent.id);
          }}
          startContent={
            agent.isRunning ? (
              <PlayIconComponent className="w-4 h-4" />
            ) : (
              <PauseIconComponent className="w-4 h-4" />
            )
          }
          isIconOnly
        ></Button>
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <WalletIconComponent className="w-4 h-4" />
          </div>
          <div>{agent.usdBalance ? `${formatUSD(agent.usdBalance)} USD` : "-"}</div>
          {agent.pnl !== undefined && agent.pnl !== null && (
            <div className={`text-sm ${agent.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
              ({formatPercent(agent.pnl)})
            </div>
          )}
        </div>
        <div>
            <p className="text-xs text-gray-500">Created at: {new Date(agent.createdAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
