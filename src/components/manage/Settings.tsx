import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { IToken, ITokenAvailable } from "@/interfaces/token";
import {
  IAgent,
  IAgentRequest,
  ISimulateTradeResponse,
} from "@/interfaces/agent";
import tokenApi from "@/services/token.service";
import BaseDatepicker from "../base/Datepicker";
import agentApi from "@/services/agent.service";
import TokenTrade from "./TokenTrade";

export default function ManageSettings({
  agentInfo,
  setSettings,
}: {
  agentInfo: IAgent;
  setSettings: (value: Partial<IAgentRequest>) => void;
}) {
  const [chooseTokens, setChooseTokens] = useState<IToken[]>(
    agentInfo.selectedTokens ?? []
  );
  const [tokenList, setTokenList] = useState<ITokenAvailable[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  const modal = useDisclosure();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateResult, setSimulateResult] =
    useState<ISimulateTradeResponse | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!agentInfo?.chainId) return;
      setIsLoadingTokens(true);
      try {
        const tokens = await tokenApi.getTokenAvailable(
          agentInfo.chainId || ""
        );
        setTokenList(tokens);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingTokens(false);
      }
    };

    fetchTokens();
  }, [agentInfo?.chainId]);

  const [strategy, setStrategy] = useState(agentInfo.strategy ?? "");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const [intervalSet, setIntervalSet] = useState(
    agentInfo.intervalSeconds
      ? {
          interval: `${agentInfo.intervalSeconds / 60 / 60}`,
          intervalUnit: "hour",
        }
      : {
          interval: "",
          intervalUnit: "hour",
        }
  );

  const [endDate, setEndDate] = useState<Date | null>(
    agentInfo.endDate ? new Date(agentInfo.endDate) : null
  );

  useEffect(() => {
    const convertInterval = () => {
      const unit = intervalSet.intervalUnit;
      const interval = parseInt(intervalSet.interval);
      if (unit === "minute") {
        return interval * 60;
      } else if (unit === "hour") {
        return interval * 60 * 60;
      } else if (unit === "day") {
        return interval * 60 * 60 * 24;
      }
    };
    setSettings({
      selectedTokens: chooseTokens,
      strategy,
      takeProfitUSD:
        takeProfit && takeProfit.length > 0
          ? parseFloat(takeProfit)
          : undefined,
      stopLossUSD:
        stopLoss && stopLoss.length > 0 ? parseFloat(stopLoss) : undefined,
      intervalSeconds: convertInterval(),
      endDate: endDate ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chooseTokens,
    strategy,
    takeProfit,
    stopLoss,
    intervalSet,
    endDate,
    // setSettings,
  ]);

  const handleSimulateTrade = async () => {
    setIsSimulating(true);
    try {
      modal.onOpen();
      const response = await agentApi.simulateTrade(agentInfo.id, {
        strategyDescription: strategy,
      });
      setSimulateResult(response);
    } catch (error) {
      console.error(error);
    }
    setIsSimulating(false);
  };

  return (
    <>
      {/* Choose tokens */}
      <Select
        className="w-full"
        // disabledKeys={data.selectedTokens?.map((token) => token.tokenAddress)}
        label="Choose tokens"
        selectionMode="multiple"
        isLoading={isLoadingTokens}
        onSelectionChange={(keys) => {
          const selectedOptions = Array.from(keys);
          const selectedTokens = tokenList
            ?.filter((token) => selectedOptions.includes(token.address))
            .map((token) => ({
              tokenSymbol: token.symbol,
              tokenAddress: token.address,
            }));
          setChooseTokens(selectedTokens);
        }}
        renderValue={(items) => {
          return (
            <div className="flex gap-2 overflow-x-auto">
              {items.map((item) => {
                const token = tokenList?.find(
                  (token) => token.address === item.key
                );
                return (
                  <div key={item.key} className="flex items-center gap-2">
                    <img
                      src={token?.logoURI}
                      alt={token?.symbol}
                      className="w-4 h-4"
                    />
                    <p>{token?.symbol}</p>
                  </div>
                );
              })}
            </div>
          );
        }}
        selectedKeys={
          tokenList.length > 0
            ? chooseTokens.map((token) => token.tokenAddress)
            : []
        }
      >
        {tokenList.map((token) => (
          <SelectItem
            key={token.address}
            value={token.address}
            textValue={token.symbol}
          >
            <div className="flex space-x-3">
              <img className="w-6 h-6" src={token.logoURI} alt={token.symbol} />
              <p>{token.symbol}</p>
            </div>
          </SelectItem>
        ))}
      </Select>
      {/* Strategies */}
      <div className="text-lg font-medium my-2">Strategies</div>
      <div>
        <Textarea
          // label="Custom Strategy"
          placeholder="Input your prompt strategy"
          value={strategy}
          className="mt-3 mb-2"
          onChange={(e) => {
            setStrategy(e.target.value);
          }}
          minRows={8}
        />
      </div>
      <div className="flex justify-end">
        <Button
          color="primary"
          variant="bordered"
          fullWidth
          onPress={modal.onOpen}
        >
          Simulate Trade
        </Button>
      </div>

      {/* Take Profit */}
      <div className="text-lg font-medium my-2">Take Profit</div>
      <Input
        placeholder="Trigger take profit price"
        value={takeProfit}
        onChange={(e) => {
          setTakeProfit(e.target.value);
        }}
      />
      <div className="text-xs text-gray-500 my-2">
        We will sell your coins with market order. It's better not to use it in
        a low liquidity market to avoid loss.
      </div>
      {/* Stop loss */}
      <div className="text-lg font-medium my-2">Stop loss</div>
      <Input
        placeholder="Trigger stop loss price"
        value={stopLoss}
        onChange={(e) => {
          setStopLoss(e.target.value);
        }}
      />
      <div className="text-xs text-gray-500 my-2">
        We will stop your agent when the price is lower than the trigger price.
      </div>
      {/* Interval + End date */}
      <div className="text-lg font-medium my-2">Interval</div>
      <div className="flex gap-2">
        <Input
          type="number"
          label="Interval"
          value={intervalSet.interval}
          onChange={(e) =>
            setIntervalSet((prev) => ({ ...prev, interval: e.target.value }))
          }
        />
        <Select
          label="Unit"
          selectedKeys={[intervalSet.intervalUnit]}
          onChange={(e) =>
            setIntervalSet((prev) => ({
              ...prev,
              intervalUnit: e.target.value,
            }))
          }
        >
          <SelectItem key="minute" value="minute">
            Minutes
          </SelectItem>
          <SelectItem key="hour" value="hour">
            Hours
          </SelectItem>
          <SelectItem key="day" value="day">
            Days
          </SelectItem>
        </Select>
      </div>
      <div className="text-lg font-medium my-2">End Date</div>
      <div className="w-full flex flex-row gap-4 mt-4">
        <BaseDatepicker
          value={endDate}
          onChange={(e) => setEndDate(e)}
          titleEnd="End Date"
          placeholder="Select End Date"
        />
      </div>
      <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
        <ModalContent>
          <ModalHeader>
            <h1>Simulate Trade</h1>
          </ModalHeader>
          <ModalBody>
            <div className="mb-2">
              <h2 className="mb-1 underline">Thoughts</h2>
              <p className="text-sm text-gray-500">
                {!simulateResult ? "-" : simulateResult?.thoughts}
              </p>
            </div>
            <div>
              <h2 className="mb-1 underline">Trade Steps</h2>
              {(!simulateResult || simulateResult?.tradeSteps.length === 0) ? "-" : simulateResult?.tradeSteps.map((step, index) => {
                const tokenInfo = tokenList.find(
                  (token) =>
                    token?.address?.toLowerCase() === step?.data?.tokenAddress?.toLowerCase()
                );

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border border-gray-200 rounded-md p-2 mb-1"
                  >
                    <TokenTrade 
                      tokenInfo={tokenInfo} 
                      action={step.type} 
                      amount={step.type === "buy" ? step.data.usdAmount : step.data.tokenAmount}
                    />

                    {/* <p>{step.type}</p>
                    {step.type === "buy" && (
                      <>
                        <p>{(step.data as BuyDto).tokenAddress}</p>
                        <p>{(step.data as BuyDto).usdAmount}</p>
                      </>
                    )}
                    {step.type === "sell" && (
                      <>
                        <p>{(step.data as SellDto).tokenAddress}</p>
                        <p>{(step.data as SellDto).tokenAmount}</p>
                      </>
                    )}
                    <p>{step.reason}</p> */}
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="bordered" onPress={handleSimulateTrade} isLoading={isSimulating} fullWidth>
              Simulate
            </Button>
            <Button color="default" variant="bordered" onPress={modal.onClose} fullWidth>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
