import axiosInstance from "@/core/axios";
import { IBalanceChart } from "@/interfaces/wallet";
import localStorageUtil from "@/utils/localStorage.util";
import { OAuthMethod } from "@getpara/react-sdk";

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

const saveDeposit = async (agentId: string, transactionHash: string) => {
  const response = await axiosInstance.post(
    `/agent/${agentId}/wallet/record-deposit`,
    { transactionHash }
  );
  return response.data;
};

const claimWallet = async (
  agentId: string,
  payload: {
    userId: string;
    identifier: string;
    identifierType:
      | OAuthMethod.TWITTER
      | OAuthMethod.DISCORD
      | OAuthMethod.TELEGRAM
      | "EMAIL"
      | "PHONE"
      | "CUSTOM_ID";
  }
) => {
  const response = await axiosInstance.post(
    `/agent/${agentId}/wallet/claim-pregen-wallet`,
    payload
  );
  return response.data;
};

const walletApi = { getBalanceChart, saveDeposit, claimWallet };

export default walletApi;
