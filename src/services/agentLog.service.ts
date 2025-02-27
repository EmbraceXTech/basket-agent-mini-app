import axiosInstance from "@/core/axios";

import { IAgentLogResponse } from "@/interfaces/agentLog";
import localStorageUtil from "@/utils/localStorage.util";

interface GetAllParams {
  agentId: number;
  page?: number;
  limit?: number;
}

const getAll = async ({
  agentId,
  page = 1,
  limit = 10,
}: GetAllParams): Promise<IAgentLogResponse> => {
  try {
    const response = await axiosInstance.get<IAgentLogResponse>(
      `/agent/${agentId}/logs`,
      {
        params: {
          page,
          limit,
        },
        headers: {
          Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const agentLogService = { getAll };

export default agentLogService;
