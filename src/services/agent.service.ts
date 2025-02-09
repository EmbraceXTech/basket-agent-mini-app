import axiosInstance from "@/core/axios";
import {
  IAgent,
  IAgentInfo,
  IAgentInfoResponse,
  IAgentRequest,
  IAgentResponse,
  IAgentWalletBalance,
  IAgentWalletBalanceResponse,
} from "@/interfaces/agent";

const createAgent = async (data: IAgentRequest) => {
  try {
    const payload = {
      ...data,
      knowledges: data.knowledges.map((knowledge) => ({
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

const getAgents = async (): Promise<IAgent[]> => {
  try {
    const response = await axiosInstance.get<IAgentResponse[]>("/agent");
    return response.data.map((agent) => ({
      ...agent,
      selectedTokens: agent.selectedTokens.map((token) => JSON.parse(token)),
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

const getAgentWalletBalance = async (agentId: number): Promise<IAgentWalletBalance[]> => {
  try {
    const response = await axiosInstance.get<IAgentWalletBalanceResponse>(
      `/agent/${agentId}/wallet/balance`
    );
    console.log(response.data);
    return response.data.balances.map((balance) => ({
      tokenSymbol: balance[0],
      balance: balance[1],
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const agentApi = { createAgent, getAgents, toggleStartPause, getAgentId, getAgentWalletBalance };

export default agentApi;
