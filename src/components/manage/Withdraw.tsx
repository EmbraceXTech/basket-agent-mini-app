import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import { IAgentInfo } from "@/interfaces/agent";
import tokenApi from "@/services/token.service";
import { useNumberState } from "@/hooks/useNumberState";
import { isValidEthereumAddress } from "@/utils/address.util";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import agentApi from "@/services/agent.service";

export default function WithdrawAsset({
  agentInfo,
}: {
  agentInfo: IAgentInfo;
}) {
  const [tab, setTab] = useState<"stableCoin" | "gasToken">("stableCoin");
  const [walletAddress, setWalletAddress] = useState("");
  const [usdcAmount, setUsdcAmount, usdcAmountString] = useNumberState();
  const [ethAmount, setEthAmount, ethAmountString] = useNumberState();
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isWithdrawCompleted, setIsWithdrawCompleted] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [transactionLink, setTransactionLink] = useState<string | null>(null);
  const modal = useDisclosure();

  const isDisabled = useMemo(() => {
    if (tab === "stableCoin") {
      return !usdcAmount || !walletAddress || isAddressInvalid;
    }
    return !ethAmount || !walletAddress || isAddressInvalid;
  }, [tab, usdcAmount, ethAmount, walletAddress, isAddressInvalid]);

  const { data: tokenInfo } = useQuery({
    queryKey: ["tokenInfo", agentInfo.chainId],
    queryFn: () => tokenApi.getTokenAvailable(agentInfo.chainId, true),
  });

  const { data: tokenBalances, isLoading: isTokenBalancesLoading, refetch: refetchTokenBalances } = useQuery({
    queryKey: ["tokenBalances", agentInfo.id],
    queryFn: () =>
      tokenApi.getTokenBalance(agentInfo.id.toString() || "", {
        addUsdBalance: true,
        addTokenInfo: true,
        includeTokenBase: true,
        chainId: agentInfo.chainId,
      }),
  });

  const { data: tokenPrice, isLoading: isTokenPriceLoading, refetch: refetchTokenPrice } = useQuery({
    queryKey: ["tokenPrices", "USDC", "ETH"],
    queryFn: () => tokenApi.getTokenPrice(["USDC", "ETH"])
  })

  const balanceData = useMemo(() => {
    if (!tokenBalances || isTokenBalancesLoading) {
      return {
        ethBalance: 0,
        usdcBalance: 0,
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

    return {
      ethBalance: Number(ethBalance),
      usdcBalance: Number(usdcBalance)
    };  }, [tokenBalances, isTokenBalancesLoading]);

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

  const handleAddressValidation = () => {
    if (walletAddress) {
      setIsAddressInvalid(!isValidEthereumAddress(walletAddress));
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const result = await agentApi.withdrawAsset(agentInfo.id, {
        assetId: tab === "stableCoin" ? "usdc" : "eth",
        amount: tab === "stableCoin" ? usdcAmount || 0 : ethAmount || 0,
        recipientAddress: walletAddress,
      });
      if (result.model.transaction && result.model.transaction.transaction_link) {
        setTransactionLink(result.model.transaction.transaction_link);
      }
      setIsWithdrawCompleted(true);
      refetchTokenBalances();
    } catch (e: any) {
      console.error(e);
      setWithdrawError(e.message);
    }

    setIsWithdrawing(false);
  };

  const handleCloseModal = () => {
    setIsWithdrawCompleted(false);
    setTransactionLink(null);
    setWithdrawError(null);
    modal.onClose();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetchTokenPrice();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchTokenPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchTokenBalances();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetchTokenBalances]);

  return (
    <div>
      <div className="text-xl font-medium text-center mt-6">
        Withdraw Crypto
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
          selectedKey={tab}
          onSelectionChange={(key) => setTab(key as "stableCoin" | "gasToken")}
        >
          <Tab
            key="stableCoin"
            className="w-full"
            title={
              <div className="flex flex-col items-center space-y-1">
                <img
                  src={
                    tokenInfo?.find(
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
            <div className="my-6 w-full space-y-4">
              <div className="w-full">
                <Input
                  label={`Destination Address`}
                  placeholder={`Recipient's ${agentInfo.chainInfo?.name} Address`}
                  variant="bordered"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  onBlur={handleAddressValidation}
                  isInvalid={isAddressInvalid}
                  errorMessage={`Invalid ${agentInfo.chainInfo?.name} address format`}
                />
              </div>

              <div className="w-full space-y-1">
                <Input
                  label={`Amount`}
                  placeholder={`Amount to withdraw`}
                  endContent={
                    <div className="flex items-center">
                      <p className="text-xs font-medium mr-2">USDC</p>
                      <p className="w-1"> </p>
                      <Button
                        size="sm"
                        onPress={() => setUsdcAmount(balanceData.usdcBalance)}
                      >
                        Max
                      </Button>
                    </div>
                  }
                  variant="bordered"
                  value={usdcAmountString}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                />

                <div className="flex items-center justify-between px-2 text-sm text-secondary-text">
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
            </div>
          </Tab>

          <Tab
            key="gasToken"
            className="w-full"
            title={
              <div className="flex flex-col items-center space-y-1">
                <img
                  src={
                    tokenInfo?.find(
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
            <div className="my-6 w-full space-y-4">
              <div className="w-full">
                <Input
                  label={`Destination Address`}
                  placeholder={`Recipient's ${agentInfo.chainInfo?.name} Address`}
                  variant="bordered"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  onBlur={handleAddressValidation}
                  errorMessage={`Invalid ${agentInfo.chainInfo?.name} address format`}
                  isInvalid={isAddressInvalid}
                />
              </div>

              <div className="w-full space-y-1">
                <div>
                  <Input
                    label={`Amount`}
                    placeholder={`Amount to withdraw`}
                    endContent={
                      <div className="flex items-center">
                        <p className="text-xs font-medium mr-2">ETH</p>
                        <p className="w-1"> </p>
                        <Button
                          size="sm"
                          onPress={() => setEthAmount(balanceData.ethBalance)}
                        >
                          Max
                        </Button>
                      </div>
                    }
                    value={ethAmountString}
                    onChange={(e) => setEthAmount(e.target.value)}
                    variant="bordered"
                  />
                </div>
                <div className="flex items-center justify-between px-2 text-sm text-secondary-text">
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
            </div>
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
      </div>
      <div className="w-full">
        <Button
          className="w-full"
          color="primary"
          onPress={modal.onOpen}
          isDisabled={isDisabled}
        >
          Withdraw
        </Button>
      </div>
      <div className="my-3 border-b border-dashed border-secondary-text mx-8" />
      <p className="text-sm text-secondary-text text-center mt-6 mx-8">
        The transaction requires some gas fee. Please make sure to withdraw
        stable coin before withdrawing gas token.
      </p>

      <Modal isOpen={modal.isOpen} onClose={handleCloseModal}>
        <ModalContent>
          <ModalHeader>Confirm Withdrawal</ModalHeader>
          <ModalBody>
            {
              isWithdrawCompleted ? (
                <div className="flex flex-col items-center justify-center">
                  <div>
                    <CheckCircleIcon className="w-12 h-12 text-primary" />
                  </div>
                  <p className="text-sm text-secondary-text">Withdrawal completed successfully.</p>
                  {
                    transactionLink && (
                      <a href={transactionLink} className="text-primary text-sm" target="_blank" rel="noopener noreferrer">
                        View Transaction
                      </a>
                    )
                  }
                </div>
              ) : (
                <p className="text-sm text-secondary-text">Please confirm the withdrawal of the selected asset.</p>
              )
            }
          </ModalBody>
          <ModalFooter>
            {
              (!isWithdrawCompleted && !withdrawError) && (
                <Button color="primary" isLoading={isWithdrawing} onPress={handleWithdraw}>
                  Confirm
                </Button>
              )
            }
            <Button onPress={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
