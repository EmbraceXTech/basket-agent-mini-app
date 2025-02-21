import axiosInstance from "@/core/axios";
import { IChain } from "@/interfaces/chain";
import localStorageUtil from "@/utils/localStorage.util";

const getChainAvailable = async () => {
  try {
    const response = await axiosInstance.get<IChain[]>(`/chain/available`, {
      headers: {
        Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
      },
    });
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
