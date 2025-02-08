// import axiosInstance from "@/core/axios";

import { IAgentRequest } from "@/interfaces/agent";

export const createAgent = async (data: IAgentRequest) => {
  try {
    console.log(data);
    // await axiosInstance.post("/agents", data);
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
