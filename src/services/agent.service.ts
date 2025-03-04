import axiosInstance from "@/core/axios";
import {
  IAgent,
  IAgentInfo,
  IAgentInfoResponse,
  IAgentRequest,
  IAgentResponse,
  ISimulateTradeRequest,
  ISimulateTradeResponse,
  IWithdrawAssetRequest,
  IWithdrawAssetResponse,
} from "@/interfaces/agent.d";
import tokenApi from "./token.service";
import chainApi from "./chain.service";
import { IChain } from "@/interfaces/chain";
import { IUpdateKnowledgeRequest } from "@/interfaces/knowledge";
import localStorageUtil from "@/utils/localStorage.util";

const createAgent = async (data: IAgentRequest): Promise<IAgent> => {
  const knowledgeFilter = data.knowledges.filter(
    (i) => i.content.length > 0 && i.content.length > 0
  );
  try {
    const payload = {
      ...data,
      knowledges: knowledgeFilter.map((knowledge) => ({
        name: knowledge.name,
        content: knowledge.content,
      })),
      intervalSeconds: data.intervalSeconds * 60,
      endDate: data.endDate ? data.endDate.toISOString() : null,
    };
    const response = await axiosInstance.post<Array<IAgentResponse>>(
      "/agent",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
        },
      }
    );
    if (response.data.length === 0) {
      throw new Error("Failed to create agent");
    }
    return {
      ...response.data[0],
      selectedTokens: response.data[0].selectedTokens.map((token) =>
        JSON.parse(token)
      ),
    };
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
    const response = await axiosInstance.get<IAgentResponse[]>("/agent", {
      headers: {
        Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
      },
    });

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
            performance: tokenBalances.performance,
            equity: tokenBalances.equity,
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

const toggleStartPause = async (agentId: number, isRunning: boolean) => {
  try {
    if (isRunning) {
      // pause
      console.log("pause");
      await axiosInstance.patch(
        `/agent/${agentId}/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
          },
        }
      );
    } else {
      // start
      console.log("start");
      await axiosInstance.patch(
        `/agent/${agentId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
          },
        }
      );
    }
    return { status: isRunning ? "pause" : "start" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAgentId = async (
  agentId: number,
  { includeChainInfo }: { includeChainInfo?: boolean } = {
    includeChainInfo: false,
  }
): Promise<IAgentInfo> => {
  try {
    const response = await axiosInstance.get<IAgentInfoResponse>(
      `/agent/${agentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
        },
      }
    );
    let chainInfo: IChain | undefined;
    if (includeChainInfo) {
      const _chainInfo = await chainApi.getChainAvailable();
      const chain = _chainInfo.find(
        (chain) => chain.chainId.toString() === response.data.chainId
      );
      chainInfo = chain;
    }
    return {
      ...response.data,
      selectedTokens: response.data.selectedTokens.map((token) =>
        JSON.parse(token)
      ),
      chainInfo: chainInfo,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const terminateAgent = async (agentId: number) => {
  // TODO: terminate agent
  try {
    await axiosInstance.delete(`/agent/${agentId}`);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateAgent = async (agentId: number, data: Partial<IAgentRequest>) => {
  // TODO: Update this function to use one endpoint
  try {
    const promises = [];
    if (data.strategy) {
      promises.push(
        axiosInstance.patch(`/agent/${agentId}/strategy`, {
          strategy: data.strategy,
        })
      );
    }
    if (data.intervalSeconds) {
      promises.push(
        axiosInstance.patch(`/agent/${agentId}/interval`, {
          intervalSeconds: data.intervalSeconds,
        })
      );
    }
    if (data.endDate) {
      promises.push(
        axiosInstance.patch(`/agent/${agentId}/end-date`, {
          endDate: data.endDate,
        })
      );
    }
    if (data.stopLossUSD) {
      promises.push(
        axiosInstance.patch(`/agent/${agentId}/stop-loss`, {
          stopLossUSD: data.stopLossUSD,
        })
      );
    }
    if (data.takeProfitUSD) {
      promises.push(
        axiosInstance.patch(`/agent/${agentId}/take-profit`, {
          takeProfitUSD: data.takeProfitUSD,
        })
      );
    }
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateKnowledge = async (
  agentId: number,
  knowledgeIds: number[],
  knowledges: IUpdateKnowledgeRequest[]
) => {
  const addPromises = knowledges
    .filter((knowledge) => !knowledge?.id)
    .map(async (knowledge) => {
      await axiosInstance.post(
        `/agent/${agentId}/knowledge`,
        {
          name: knowledge.name,
          content: knowledge.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
          },
        }
      );
    });
  const removePromises = knowledgeIds.map(async (id) => {
    await axiosInstance.delete(`/agent/${agentId}/knowledge/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
      },
    });
  });
  await Promise.all([...addPromises, ...removePromises]);
  return true;
};

const withdrawAsset = async (agentId: number, data: IWithdrawAssetRequest) => {
  try {
    return axiosInstance
      .post<IWithdrawAssetResponse>(`/agent/${agentId}/wallet/withdraw`, data, {
        headers: {
          Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
        },
      })
      .then((res) => res.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const simulateTrade = async (agentId: number, data: ISimulateTradeRequest) => {
  try {
    return axiosInstance
      .post<ISimulateTradeResponse>(`/agent/${agentId}/simulate-trade`, data, {
        headers: {
          Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
        },
      })
      .then((res) => res.data);
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
  updateAgent,
  updateKnowledge,
  withdrawAsset,
  simulateTrade,
};

export default agentApi;
