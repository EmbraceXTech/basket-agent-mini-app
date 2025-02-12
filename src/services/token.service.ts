import axiosInstance from "@/core/axios";
import {
  IAgentWalletBalance,
  IAgentWalletBalanceResponse,
  ITokenPriceResponse,
} from "@/interfaces/token.d";
import { ITokenAvailable } from "@/interfaces/token";
import agentApi from "./agent.service";

const getTokenAvailable = async (
  chainId: string
): Promise<ITokenAvailable[]> => {
  const response = await axiosInstance.get<ITokenAvailable[]>(
    `/token/available-tokens?chainId=${chainId}`
  );
  return response.data;
};

const getTokenPrice = async (
  tokenSymbols: string[]
): Promise<ITokenPriceResponse[]> => {
  const response = await axiosInstance.get<ITokenPriceResponse[]>(
    `/price/${tokenSymbols.join(",")}`
  );
  return response.data;
};

const getTokenBalance = async (
  agentId: string,
  {
    addUsdBalance,
    addTokenInfo,
  }: { addUsdBalance?: boolean; addTokenInfo?: boolean } = {
    addUsdBalance: false,
    addTokenInfo: false,
  }
): Promise<IAgentWalletBalance> => {
  try {
    const response = await axiosInstance.get<IAgentWalletBalanceResponse>(
      `/agent/${agentId}/wallet/balance`
    );
    let balanceUsd: [string, number][] = [];
    let tokenInfo: ITokenAvailable[] = [];
    if (addUsdBalance) {
      const tokenFocuses = response.data.tokens
        .map((token) => token[0].toUpperCase())
        .filter((token) => token !== "USDC");
      const tokenPrice = await getTokenPrice(tokenFocuses);
      balanceUsd = response.data.tokens.map((token) => {
        const convertRate = tokenPrice.find(
          (price) => price.token === token[0].toUpperCase()
        );
        return [token[0], +token[1] * (convertRate?.price ?? 1)];
      });
    }
    if (addTokenInfo) {
      const agent = await agentApi.getAgentId(+agentId);
      const _tokenInfo = await getTokenAvailable(agent.chainId);
      tokenInfo = _tokenInfo.map((token) => ({
        ...token,
        symbol: token.symbol.toUpperCase(),
      }));
    }
    return { ...response.data, balanceUsd, tokenInfo };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const tokenApi = { getTokenBalance, getTokenAvailable };

export default tokenApi;
