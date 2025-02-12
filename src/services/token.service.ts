import axiosInstance from "@/core/axios";
import { ITokenAvailable, ITokenBalance } from "@/interfaces/token";

const getTokenAvailable = async (
  chainId: string
): Promise<ITokenAvailable[]> => {
  const response = await axiosInstance.get<ITokenAvailable[]>(
    `/token/available-tokens?chainId=${chainId}`
  );
  return response.data;
};

const getTokenBalance = async (id: string): Promise<ITokenBalance[]> => {
  console.log(id);
  const response: ITokenBalance[] = [
    {
      tokenSymbol: "ETH",
      tokenAddress: "0x0000000000000000000000000000000000000000",
      balance: 100,
      balanceUsd: 10000,
      pnl: 100,
    },
    {
      tokenSymbol: "BTC",
      tokenAddress: "0x0000000000000000000000000000000000000000",
      balance: 100,
      balanceUsd: 10000,
      pnl: 80,
    },
  ];

  return response;
};

const tokenApi = { getTokenBalance, getTokenAvailable };

export default tokenApi;
