import axiosInstance from "@/core/axios";

import { IAgentLog, IAgentLogResponse } from "@/interfaces/agentLog";
import { formatDateOnly } from "@/utils/datetime.util";

const getAll = async (
  agentId: number
): Promise<Record<string, IAgentLog[]>> => {
  try {
    const response = await axiosInstance.get<IAgentLogResponse[]>(
      `/agent/${agentId}/logs`
    );
    const groupedLogs = response.data?.reduce((acc, log) => {
      const date = new Date(log.createdAt);
      const dateString = formatDateOnly(date);
      if (!acc[dateString]) {
        acc[dateString] = [log];
      } else {
        acc[dateString].push(log);
      }
      return acc;
    }, {} as Record<string, IAgentLog[]>);

    return groupedLogs;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const agentLogService = { getAll };

export default agentLogService;
