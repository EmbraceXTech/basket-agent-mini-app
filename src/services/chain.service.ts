import axiosInstance from "@/core/axios";
import { IChain } from "@/interfaces/chain";

const getChainAvailable = async () => {
  try {
    const response = await axiosInstance.get<IChain[]>(`/chain/available`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const chainApi = {
  getChainAvailable,
};

export default chainApi;
