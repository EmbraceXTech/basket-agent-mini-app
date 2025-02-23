import axiosInstance from "@/core/axios";
import { IBalanceChart } from "@/interfaces/wallet";
import localStorageUtil from "@/utils/localStorage.util";

const getBalanceChart = async (agentId: string): Promise<IBalanceChart[]> => {
  const response = await axiosInstance.get<IBalanceChart[]>(
    `/agent/${agentId}/wallet/balance-chart`,
    {
      headers: {
        Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

const walletApi = { getBalanceChart };

export default walletApi;
