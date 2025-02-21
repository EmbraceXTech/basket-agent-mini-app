import axiosInstance from "@/core/axios";
import {
  IAgentWalletBalance,
  IAgentWalletBalanceResponse,
  ITokenPriceResponse,
} from "@/interfaces/token.d";
import { ITokenAvailable } from "@/interfaces/token";
import agentApi from "./agent.service";
import localStorageUtil from "@/utils/localStorage.util";

const getTokenAvailable = async (
  chainId: string,
  includeTokenBase?: boolean
): Promise<ITokenAvailable[]> => {
  const response = await axiosInstance.get<ITokenAvailable[]>(
    `/token/available-tokens?chainId=${chainId}${
      includeTokenBase ? "&includeTokenBase=true" : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

const getTokenPrice = async (
  tokenSymbols: string[]
): Promise<ITokenPriceResponse[]> => {
  const tokenSymbolsWithoutUSDC = tokenSymbols.filter(
    (token) => token !== "USDC"
  );
  const response =
    tokenSymbolsWithoutUSDC.length > 0
      ? await axiosInstance.get<ITokenPriceResponse[]>(
          `/price/${tokenSymbolsWithoutUSDC.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorageUtil.getItem(
                "accessToken"
              )}`,
            },
          }
        )
      : { data: [] };
  return [
    ...response.data,
    {
      token: "USDC",
      price: 1,
      source: "self",
      quote: "USDC",
    },
  ];
};

const getTokenBalance = async (
  agentId: string,
  {
    addUsdBalance,
    addTokenInfo,
    selectTokenSymbol,
    includeTokenBase,
  }: {
    addUsdBalance?: boolean;
    addTokenInfo?: boolean;
    selectTokenSymbol?: string[];
    includeTokenBase?: boolean;
    chainId?: string;
  } = {
    addUsdBalance: false,
    addTokenInfo: false,
    selectTokenSymbol: [],
    includeTokenBase: false,
  }
): Promise<IAgentWalletBalance> => {
  try {
    const response = await axiosInstance.get<IAgentWalletBalanceResponse>(
      `/agent/${agentId}/wallet/balance`,
      {
        headers: {
          Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
        },
      }
    );
    let balanceUsd: [string, number][] = [];
    let tokenInfo: ITokenAvailable[] = [];
    let tokenPrice: ITokenPriceResponse[] = [];
    if (response.data.tokens.length === 0) {
      return {
        ...response.data,
        balanceUsd: [] as [string, number][],
        tokenInfo: [] as ITokenAvailable[],
      };
    }
    if (addUsdBalance) {
      const tokenFocuses =
        selectTokenSymbol && selectTokenSymbol.length > 0
          ? selectTokenSymbol.map((token) => token.toUpperCase())
          : response.data.tokens
              .map((token) => token[0].toUpperCase())
              .filter((token) => token !== "USDC");
      tokenPrice = await getTokenPrice(tokenFocuses);
      balanceUsd =
        selectTokenSymbol && selectTokenSymbol.length > 0
          ? selectTokenSymbol.map((token) => {
              const convertRate = tokenPrice.find(
                (price) => price.token === token
              );
              const _balance = response.data.tokens.find(
                (t) => t[0].toUpperCase() === token.toUpperCase()
              ) || ["", ""];
              return [token, +_balance[1] * (convertRate?.price ?? 1)];
            })
          : response.data.tokens.map((token) => {
              const convertRate = tokenPrice.find(
                (price) => price.token === token[0].toUpperCase()
              );
              return [token[0], +token[1] * (convertRate?.price ?? 1)];
            });
    }
    if (addTokenInfo) {
      const agent = await agentApi.getAgentId(+agentId);
      const _tokenInfo = await getTokenAvailable(
        agent.chainId,
        includeTokenBase
      );
      tokenInfo = _tokenInfo.map((token) => ({
        ...token,
        symbol: token.symbol.toUpperCase(),
      }));
    }
    return { ...response.data, balanceUsd, tokenInfo, tokenPrice };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const tokenApi = { getTokenBalance, getTokenAvailable, getTokenPrice };

export default tokenApi;
