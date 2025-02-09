import axiosInstance from "@/core/axios";
import {
  IAgent,
  IAgentInfo,
  IAgentInfoResponse,
  IAgentRequest,
  IAgentResponse,
} from "@/interfaces/agent";

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

const agentApi = { createAgent, getAgents, toggleStartPause, getAgentId };

export default agentApi;
