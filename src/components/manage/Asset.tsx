import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Input, Tab, Tabs } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { IAgentInfo } from "@/interfaces/agent";
import { truncateAddress } from "@/utils/string.util";

import EthereumQRGenerator from "../base/EthereumQRGenerator";
import tokenApi from "@/services/token.service";
import { useNumberState } from "@/hooks/useNumberState";
import { parseUnits } from "viem";

export default function ManageAsset({ agentInfo }: { agentInfo: IAgentInfo }) {
  const [isCopied, setIsCopied] = useState(false);
  const [usdcAmount, setUsdcAmount, usdcAmountString] = useNumberState();
  const [ethAmount, setEthAmount, ethAmountString] = useNumberState();

  const { data: tokenInfo } = useQuery({
    queryKey: ["tokenInfo", agentInfo.chainId],
    queryFn: () => tokenApi.getTokenAvailable(agentInfo.chainId, true),
  });

  const { data: tokenPrice, isLoading: isTokenPriceLoading, refetch: refetchTokenPrice } = useQuery({
    queryKey: ["tokenPrices", "USDC", "ETH"],
    queryFn: () => tokenApi.getTokenPrice(["USDC", "ETH"])
  })

  const {
    data: tokenBalances,
    isLoading: isTokenBalancesLoading,
    refetch: refetchTokenBalances,
  } = useQuery({
    queryKey: ["tokenBalances", agentInfo.id],
    queryFn: () =>
      tokenApi.getTokenBalance(agentInfo.id.toString() || "", {
        addUsdBalance: true,
        addTokenInfo: true,
        includeTokenBase: true,
        chainId: agentInfo.chainId,
      }),
  });

  const balanceData = useMemo(() => {
    if (!tokenBalances || isTokenBalancesLoading) {
      return {
        ethBalance: 0,
        usdcBalance: 0,
        ethBalanceValueUsd: 0,
        usdcBalanceValueUsd: 0,
      };
    }
    const ethBalance =
      tokenBalances?.tokens?.find(
        (token) => token[0].toLowerCase() === "eth"
      )?.[1] || 0;
    const usdcBalance =
      tokenBalances?.tokens?.find(
        (token) => token[0].toLowerCase() === "usdc"
      )?.[1] || 0;
    const ethBalanceValueUsd =
      tokenBalances?.balanceUsd?.find(
        (token) => token[0].toLowerCase() === "eth"
      )?.[1] || 0;
    const usdcBalanceValueUsd =
      tokenBalances?.balanceUsd?.find(
        (token) => token[0].toLowerCase() === "usdc"
      )?.[1] || 0;
    return {
      ethBalance: Number(ethBalance),
      usdcBalance: Number(usdcBalance),
      ethBalanceValueUsd: Number(ethBalanceValueUsd),
      usdcBalanceValueUsd: Number(usdcBalanceValueUsd),
    };
  }, [tokenBalances, isTokenBalancesLoading]);

  const gasTokenInfo = useMemo(() => {
    return tokenInfo?.find((token) => token.symbol.toUpperCase() === "ETH");
  }, [tokenInfo]);

  const stableCoinInfo = useMemo(() => {
    return tokenInfo?.find((token) => token.symbol.toUpperCase() === "USDC");
  }, [tokenInfo]);

  const priceData = useMemo(() => {
    if (!tokenPrice || isTokenPriceLoading) {
      return {
        usdcPrice: 0,
        ethPrice: 0
      };
    }
    const usdcPrice = tokenPrice.find(token => token.token === "USDC")?.price || 0;
    const ethPrice = tokenPrice.find(token => token.token === "ETH")?.price || 0;
    return {
      usdcPrice,
      ethPrice
    };
  }, [tokenPrice, isTokenPriceLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(agentInfo.walletKey.address);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetchTokenBalances();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchTokenBalances]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchTokenPrice();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchTokenPrice]);

  return (
    <div>
      <div className="text-xl font-medium text-center mt-6">Deposit Crypto</div>
      <div
        className="flex items-center justify-center space-x-1 mt-2 cursor-pointer"
        onClick={handleCopy}
      >
        <div className="text-sm text-secondary-text">
          {truncateAddress(agentInfo.walletKey.address)}
        </div>
        <button onClick={handleCopy} id="copy-address">
          {isCopied ? (
            <CheckCircleIcon className="w-4 h-4" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="mt-6 my-10 flex flex-col items-center justify-center">
        <Tabs
          aria-label="Tabs radius"
          radius="full"
          variant="underlined"
          color="primary"
          fullWidth
          classNames={{
            tab: "h-fit",
          }}
        >
          <Tab
            key="gasToken"
            className="w-full"
            title={
              <div className="flex flex-col items-center space-y-1">
                <img
                  src={gasTokenInfo?.logoURI}
                  alt="ETH"
                  className="w-6 h-6"
                />
                <p className="text-xs font-medium">Gas Token</p>
              </div>
            }
          >
            <div className="my-6 flex justify-center">
              {/* native token */}
              <EthereumQRGenerator
                to={agentInfo.walletKey.address}
                chainId={agentInfo.chainId}
                isNativeToken={true}
                amount={ethAmount ? parseUnits(ethAmount.toString(), gasTokenInfo?.decimals || 18).toString() : undefined}
              />
            </div>
            <div className="flex flex-col items-center w-full">
              <Input
                label={`Amount`}
                placeholder={`Amount to deposit`}
                className="w-full max-w-md mb-1"
                endContent={
                  <div className="flex items-center">
                    <p className="text-xs font-medium mr-2">ETH</p>
                  </div>
                }
                variant="bordered"
                value={ethAmountString}
                onChange={(e) => setEthAmount(e.target.value)}
              />
              <div className="flex items-center justify-between px-2 text-sm text-secondary-text w-full max-w-md">
                <p className="text-xs font-medium">
                  ~${" "}
                  {((ethAmount || 0) * priceData.ethPrice).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs font-medium">
                  Available:{" "}
                  {balanceData.ethBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}{" "}
                  ETH
                </p>
              </div>
            </div>
          </Tab>
          <Tab
            key="stableCoin"
            className="w-full"
            title={
              <div className="flex flex-col items-center space-y-1">
                <img
                  src={stableCoinInfo?.logoURI}
                  alt="USDC"
                  className="w-6 h-6"
                />
                <p className="text-xs font-medium">Stable Coin</p>
              </div>
            }
          >
            {/* erc20 token */}
            <div className="my-6 flex justify-center">
              <EthereumQRGenerator
                tokenAddress={stableCoinInfo?.address}
                to={agentInfo.walletKey.address}
                chainId={agentInfo.chainId}
                amount={usdcAmount ? parseUnits(usdcAmount.toString(), stableCoinInfo?.decimals || 6).toString() : undefined}
                isNativeToken={false}
              />
            </div>

            <div className="flex flex-col items-center w-full">
              <Input
                label={`Amount`}
                placeholder={`Amount to deposit`}
                className="w-full max-w-md mb-1"
                endContent={
                  <div className="flex items-center">
                    <p className="text-xs font-medium mr-2">USDC</p>
                  </div>
                }
                variant="bordered"
                value={usdcAmountString}
                onChange={(e) => setUsdcAmount(e.target.value)}
              />

              <div className="flex items-center justify-between px-2 text-sm text-secondary-text w-full max-w-md">
                <p className="text-xs font-medium">
                  ~${" "}
                  {((usdcAmount || 0) * priceData.usdcPrice).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs font-medium">
                  Available:{" "}
                  {balanceData.usdcBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDC
                </p>
              </div>
            </div>
          </Tab>
        </Tabs>
        <div className="bg-[#F8F9FB] flex space-x-3 px-4 py-2 rounded-full mt-6">
          <img
            src={agentInfo.chainInfo?.iconUrl}
            alt={agentInfo.chainInfo?.name}
            className="w-6 h-6"
          />
          <p className="">{agentInfo.chainInfo?.name}</p>
        </div>
      </div>
      <div className="my-3 border-b border-dashed border-secondary-text mx-8" />
      <p className="text-sm text-secondary-text text-center mt-6 mx-8">
        Fund your wallet by transfering crypto from another wallet or account to
        the address above
      </p>
    </div>
  );
}
