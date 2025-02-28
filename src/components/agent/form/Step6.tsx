import { useQuery } from "@tanstack/react-query";
import { Button, Input, Spinner, Tab, Tabs } from "@heroui/react";

import agentApi from "@/services/agent.service";
import tokenApi from "@/services/token.service";
import useStepperStore from "@/stores/createAgent.store";

import EthereumQRGenerator from "@/components/base/EthereumQRGenerator";
import { useMemo, useState } from "react";
import { truncateAddress } from "@/utils/string.util";
import walletApi from "@/services/wallet.service";
import toast from "react-hot-toast";

export default function Step6() {
  const { data } = useStepperStore();

  const [tab, setTab] = useState("gasToken");
  const [usdcTransactionHash, setUsdcTransactionHash] = useState("");
  const [ethTransactionHash, setEthTransactionHash] = useState("");
  const [isSavingUSDCDeposit, setIsSavingUSDCDeposit] = useState(false);
  const [isSavingETHDeposit, setIsSavingETHDeposit] = useState(false);

  const { data: agentInfo, isLoading } = useQuery({
    queryKey: ["agent", data.id],
    queryFn: () =>
      agentApi.getAgentId(+(data.id || 0), { includeChainInfo: true }),
    enabled: !!data.id,
  });

  const { data: tokenBalances, isLoading: isTokenBalancesLoading } = useQuery({
    queryKey: ["tokenBalances", agentInfo?.id],
    queryFn: () =>
      tokenApi.getTokenBalance((agentInfo?.id || "").toString(), {
        chainId: agentInfo?.chainId,
        includeTokenBase: true,
        addTokenInfo: true,
      }),
    enabled: !!agentInfo?.id,
    refetchInterval: 10000, // 10 seconds
  });

  const balanceToken = useMemo(() => {
    const ethSymbol = "ETH";
    const usdcSymbol = "USDC";

    const ethToken = tokenBalances?.tokens.find(
      (token) => token[0] === ethSymbol
    );
    const usdcToken = tokenBalances?.tokens.find(
      (token) => token[0] === usdcSymbol
    );

    const ethBalance = ethToken ? ethToken[1] : "0.00";
    const usdcBalance = usdcToken ? usdcToken[1] : "0.00";

    return {
      ethBalance,
      usdcBalance,
    };
  }, [tokenBalances]);

  const handleSaveDeposit = async () => {
    try {
      if (!agentInfo) {
        return;
      }

      if (tab === "gasToken") {
        setIsSavingETHDeposit(true);
        await walletApi.saveDeposit(
          agentInfo.id.toString() || "",
          ethTransactionHash
        );
        toast.success("ETH deposit saved");
      } else {
        setIsSavingUSDCDeposit(true);
        await walletApi.saveDeposit(
          agentInfo.id.toString() || "",
          usdcTransactionHash
        );
        toast.success("USDC deposit saved");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to save deposit");
    }

    setIsSavingETHDeposit(false);
    setIsSavingUSDCDeposit(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col space-y-6 justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!data.id) {
    return (
      <div className="flex-1 flex flex-col space-y-6 justify-center items-center h-full">
        <div className="text-2xl font-medium">Agent ID is required</div>
      </div>
    );
  }
  return (
    <>
      {agentInfo ? (
        <div className="flex-1 flex flex-col items-center space-y-6 h-full">
          <Tabs
            aria-label="Tabs radius"
            radius="full"
            variant="underlined"
            color="primary"
            fullWidth
            classNames={{
              tab: "h-fit",
            }}
            selectedKey={tab}
            onSelectionChange={(key) => setTab(key as string)}
          >
            <Tab
              key="gasToken"
              title={
                <div className="flex flex-col items-center space-y-1">
                  <img
                    src={
                      tokenBalances?.tokenInfo?.find(
                        (token) => token.symbol.toUpperCase() === "ETH"
                      )?.logoURI
                    }
                    alt="ETH"
                    className="w-6 h-6"
                  />
                  <p className="text-xs font-medium">Gas Token</p>
                </div>
              }
            >
              <div className="my-6">
                {/* native token */}
                <EthereumQRGenerator
                  to={agentInfo.walletKey.address}
                  chainId={agentInfo.chainId}
                  // tokenAddress={agentInfo.walletKey.address}
                  isNativeToken={true}
                />
              </div>
            </Tab>
            <Tab
              key="logs"
              title={
                <div className="flex flex-col items-center space-y-1">
                  <img
                    src={
                      tokenBalances?.tokenInfo?.find(
                        (token) => token.symbol.toUpperCase() === "USDC"
                      )?.logoURI
                    }
                    alt="USDC"
                    className="w-6 h-6"
                  />
                  <p className="text-xs font-medium">Stable Coin</p>
                </div>
              }
            >
              {/* erc20 token */}
              <EthereumQRGenerator
                tokenAddress={
                  tokenBalances?.tokenInfo?.find(
                    (token) => token.symbol.toUpperCase() === "USDC"
                  )?.address
                }
                to={agentInfo.walletKey.address}
                chainId={agentInfo.chainId}
                isNativeToken={false}
              />
            </Tab>
          </Tabs>
          <div className="bg-[#F8F9FB] flex space-x-3 px-4 py-2 rounded-full">
            <img
              src={agentInfo.chainInfo?.iconUrl}
              alt={agentInfo.chainInfo?.name}
              className="w-6 h-6"
            />
            <p className="">{agentInfo.chainInfo?.name}</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="w-full flex justify-between items-center bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg px-4 py-2">
              <p className="text-sm font-medium">
                {truncateAddress(agentInfo.walletKey.address)}
              </p>
              <Button
                size="sm"
                variant="solid"
                className="bg-primary text-white font-medium rounded-full"
                onPress={() => {
                  navigator.clipboard.writeText(agentInfo.walletKey.address);
                }}
              >
                Copy
              </Button>
            </div>
            {/* Balance */}
            <div className="w-full text-sm bg-white border border-[#E5E7EB] rounded-lg flex justify-between items-center px-4 py-3">
              <div className="text-[#737580] font-medium">Gas Fee</div>
              <p className="text-black">
                {isTokenBalancesLoading ? (
                  <Spinner />
                ) : (
                  `${balanceToken.ethBalance ?? "0.00"} ETH`
                )}
              </p>
            </div>
            <div className="w-full bg-white text-sm border border-[#E5E7EB] rounded-lg flex justify-between items-center px-4 py-3">
              <div className="text-[#737580]  font-medium">Wallet Balance</div>
              <p className="text-black">
                {isTokenBalancesLoading ? (
                  <Spinner />
                ) : (
                  `${balanceToken.usdcBalance ?? "0.00"} USDC`
                )}
              </p>
            </div>
            <div className="flex flex-col items-center w-full">
              <Input
                placeholder={`Enter deposit transaction hash`}
                className="w-full max-w-md"
                classNames={{
                  inputWrapper: "h-12",
                }}
                variant="bordered"
                value={tab === "gasToken" ? ethTransactionHash : usdcTransactionHash}
                onChange={(e) => {
                  if (tab === "gasToken") {
                    setEthTransactionHash(e.target.value);
                  } else {
                    setUsdcTransactionHash(e.target.value);
                  }
                }}
                description="Enter the deposit transaction hash to record agent initial balance."
              />
              <Button
                className="w-full max-w-md bt-1"
                color="primary"
                variant="bordered"
                onPress={handleSaveDeposit}
                isDisabled={tab === "gasToken" ? !ethTransactionHash : !usdcTransactionHash}
                isLoading={tab === "gasToken" ? isSavingETHDeposit : isSavingUSDCDeposit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6 justify-center items-center h-full">
          <div className="text-2xl font-medium">Agent not found</div>
        </div>
      )}
    </>
  );
}
