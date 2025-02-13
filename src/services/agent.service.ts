import axiosInstance from "@/core/axios";
import {
  IAgent,
  IAgentInfo,
  IAgentInfoResponse,
  IAgentRequest,
  IAgentResponse,
} from "@/interfaces/agent.d";
import tokenApi from "./token.service";
import chainApi from "./chain.service";
import { IChain } from "@/interfaces/chain";

const createAgent = async (data: IAgentRequest) => {
  const knowledgeFilter = data.knowledges.filter(
    (i) => i.content.length > 0 && i.content.length > 0
  );
  try {
    const payload = {
      ...data,
      knowledges: knowledgeFilter.map((knowledge) => ({
        ...knowledge,
        content: knowledge.content,
      })),
      intervalSeconds: data.intervalSeconds * 60,
      endDate: data.endDate.toISOString(),
    };
    console.log(payload);
    await axiosInstance.post("/agent", payload);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAgents = async (
  {
    includeTotalBalance,
    includeChainInfo,
  }: { includeTotalBalance?: boolean; includeChainInfo?: boolean } = {
    includeTotalBalance: false,
    includeChainInfo: false,
  }
): Promise<IAgent[]> => {
  try {
    const response = await axiosInstance.get<IAgentResponse[]>("/agent");

    let chainInfo: IChain[] = [];

    if (includeChainInfo) {
      chainInfo = await chainApi.getChainAvailable();
    }

    if (includeTotalBalance) {
      const agentsWithTotalBalance = await Promise.all(
        response.data.map(async (agent) => {
          const tokenBalances = await tokenApi.getTokenBalance(
            agent.id.toString()
          );
          return {
            ...agent,
            selectedTokens: agent.selectedTokens.map((token) =>
              JSON.parse(token)
            ),
            totalBalance: tokenBalances.balance,
            chainInfo: chainInfo.find(
              (chain) => chain.chainId.toString() === agent.chainId
            ),
          };
        })
      );
      return agentsWithTotalBalance;
    }
    return response.data.map((agent) => ({
      ...agent,
      selectedTokens: agent.selectedTokens.map((token) => JSON.parse(token)),
      chainInfo: chainInfo.find(
        (chain) => chain.chainId.toString() === agent.chainId
      ),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const toggleStartPause = async (agentId: number) => {
  try {
    console.log(agentId);
    // await axiosInstance.post(`/agents/${agentId}/toggle-start-pause`);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAgentId = async (agentId: number): Promise<IAgentInfo> => {
  try {
    const response = await axiosInstance.get<IAgentInfoResponse>(
      `/agent/${agentId}`
    );
    return {
      ...response.data,
      selectedTokens: response.data.selectedTokens.map((token) =>
        JSON.parse(token)
      ),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const terminateAgent = async (agentId: number) => {
  try {
    // await axiosInstance.delete(`/agent/${agentId}`);
    console.log(`terminate agent ${agentId}`);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const agentApi = {
  createAgent,
  getAgents,
  toggleStartPause,
  getAgentId,
  terminateAgent,
};

export default agentApi;
