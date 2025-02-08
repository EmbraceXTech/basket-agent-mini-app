// import axiosInstance from "@/core/axios";

import { IAgentRequest, IAgentResponse } from "@/interfaces/agent";

const agents: IAgentResponse[] = [
  {
    id: "1",
    chainId: "1",
    selectedTokens: [
      {
        tokenAddress: "0x123",
        tokenSymbol: "token1",
      },
      {
        tokenAddress: "0x123",
        tokenSymbol: "token2",
      },
    ],
    strategy: "strategy",
    walletAddress: "walletAddress",
    intervalSeconds: 10,
    endDate: new Date(),
    isRunning: true,
    name: "agent1",
  },
  {
    id: "2",
    chainId: "2",
    selectedTokens: [
      {
        tokenAddress: "0x123",
        tokenSymbol: "token1",
      },
    ],
    strategy: "strategy",
    walletAddress: "walletAddress",
    intervalSeconds: 10,
    endDate: new Date(),
    isRunning: false,
    name: "agent2",
  },
];

const createAgent = async (data: IAgentRequest) => {
  try {
    console.log(data);
    // await axiosInstance.post("/agents", data);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAgents = async () => {
  try {
    // const response = await axiosInstance.get<IAgentResponse[]>("/agents");
    return agents;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const toggleStartPause = async (agentId: string) => {
  try {
    console.log(agentId);
    // await axiosInstance.post(`/agents/${agentId}/toggle-start-pause`);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAgentId = async (agentId: string) => {
  try {
    const agent = agents.find((agent) => agent.id === agentId);
    // const response = await axiosInstance.get<IAgentResponse>(`/agents/${agentId}`);
    return agent;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const agentApi = { createAgent, getAgents, toggleStartPause, getAgentId };

export default agentApi;
