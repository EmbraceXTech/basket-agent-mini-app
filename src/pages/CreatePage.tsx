import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, SelectItem, Textarea, Input } from "@heroui/react";
import { Page } from "@/components/base/Page";
import Header from "@/components/layout/Header";
import { TOKEN_LIST } from "@/constants/token.constant";
import { DEFAULT_CHAIN_ID } from "@/constants/chain.constant";

const PRESET_STRATEGIES = [
  {
    id: 1,
    name: "Conservative DCA",
    description: "Dollar-cost averaging with risk management",
    prompt:
      "Buy tokens gradually over time using DCA strategy. Maintain stop loss at -5%. Take profit at +10%.",
  },
  {
    id: 2,
    name: "Momentum Trading",
    description: "Follow market trends with technical indicators",
    prompt:
      "Monitor RSI and MACD indicators. Buy when momentum is positive, sell on negative crossovers.",
  },
  {
    id: 3,
    name: "Custom Strategy",
    description: "Create your own trading strategy",
    prompt: "",
  },
];

interface IKnowledge {
  id: number;
  name: string;
  content: string;
}

export default function CreatePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    selectedTokens: [] as string[],
    strategy: PRESET_STRATEGIES[0].prompt,
    knowledge: [] as IKnowledge[],
    interval: "1",
    intervalUnit: "hour",
    endDate: null as Date | null,
  });

  const [selectedStrategy, setSelectedStrategy] = useState(
    "0"
  );

  const availableTokens = useMemo(() => {
    return TOKEN_LIST[DEFAULT_CHAIN_ID];
  }, []);

  const handleTokenSelection = (keys: Set<string>) => {
    const selectedTokens = availableTokens
      .filter((token) => Array.from(keys).includes(token.address))
      .map((token) => token.address);
    setFormData((prev) => ({ ...prev, selectedTokens }));
  };

  const handleStrategyChange = (strategyId: string) => {
    const strategy = PRESET_STRATEGIES.find((s) => s.id === Number(strategyId));
    if (strategy) {
      setSelectedStrategy(strategyId);
      setFormData((prev) => ({ ...prev, strategy: strategy.prompt }));
    }
  };

  const handleAddKnowledge = () => {
    const newKnowledge: IKnowledge = {
      id: Date.now(),
      name: "",
      content: "",
    };
    setFormData((prev) => ({
      ...prev,
      knowledge: [...prev.knowledge, newKnowledge],
    }));
  };

  const handleKnowledgeChange = (
    id: number,
    field: keyof IKnowledge,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      knowledge: prev.knowledge.map((k) =>
        k.id === id ? { ...k, [field]: value } : k
      ),
    }));
  };

  const handleDeleteKnowledge = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      knowledge: prev.knowledge.filter((k) => k.id !== id),
    }));
  };

  const handleCreate = async () => {
    try {
      // Call API to create agent
      // await agentApi.createAgent(formData);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Select Tokens</h2>
            <Select
              items={availableTokens}
              className="overflow-x-auto"
              aria-label="Select tokens"
              selectionMode="multiple"
              selectedKeys={new Set(formData.selectedTokens)}
              placeholder="Select tokens"
              onSelectionChange={handleTokenSelection}
              renderValue={(items) => {
                return (
                  <div className="flex gap-2 overflow-x-auto">
                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <div className="w-8 h-6">
                          <img
                            className="w-6 h-6"
                            src={item.data.imageUrl}
                            alt={item.data.symbol}
                          />
                        </div>
                        <div className="w-full">{item.data.symbol}</div>
                      </div>
                    ))}
                  </div>
                );
              }}
            >
              {(token) => (
                <SelectItem
                  key={token.address}
                  textValue={token.symbol}
                  startContent={
                    <img
                      src={token.imageUrl}
                      alt={token.symbol}
                      className="w-6 h-6"
                    />
                  }
                >
                  {token.symbol}
                </SelectItem>
              )}
            </Select>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Trading Strategy</h2>
            <Select
              label="Select strategy template"
              selectedKeys={[selectedStrategy]}
              onChange={(e) => handleStrategyChange(e.target.value)}
            >
              {PRESET_STRATEGIES.map((strategy) => (
                <SelectItem key={strategy.id} value={strategy.id.toString()}>
                  {strategy.name}
                </SelectItem>
              ))}
            </Select>
            <Textarea
              label="Strategy Prompt"
              placeholder="Describe your trading strategy..."
              value={formData.strategy}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, strategy: e.target.value }))
              }
              className="min-h-[200px]"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Knowledge Base</h2>
              <Button size="sm" variant="light" onPress={handleAddKnowledge}>
                Add Knowledge
              </Button>
            </div>
            <div className="space-y-4">
              {formData.knowledge.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between">
                    <Input
                      placeholder="Knowledge name"
                      value={item.name}
                      onChange={(e) =>
                        handleKnowledgeChange(item.id, "name", e.target.value)
                      }
                    />
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => handleDeleteKnowledge(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Knowledge content"
                    value={item.content}
                    onChange={(e) =>
                      handleKnowledgeChange(item.id, "content", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Trading Settings</h2>
            <div className="flex gap-2">
              <Input
                type="number"
                label="Interval"
                value={formData.interval}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, interval: e.target.value }))
                }
              />
              <Select
                label="Unit"
                selectedKeys={[formData.intervalUnit]}
                onChange={(e) =>
                  setFormData((prev) => ({
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
            <Input
              type="datetime-local"
              label="End Date (Optional)"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  endDate: e.target.value ? new Date(e.target.value) : null,
                }))
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Page
      back={true}
      onBack={() => currentStep > 0 && setCurrentStep((prev) => prev - 1)}
    >
      <div className="w-full h-screen p-4 flex flex-col">
        <Header title={`Create Agent (${currentStep + 1}/4)`} />
        <div className="flex-1 overflow-y-auto">{renderStep()}</div>
        <div className="mt-4">
          {currentStep < 3 ? (
            <Button
              className="w-full bg-[#FF4F29] text-white rounded-full"
              onPress={() => setCurrentStep((prev) => prev + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              className="w-full bg-[#FF4F29] text-white rounded-full"
              onPress={handleCreate}
            >
              Create Agent
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
}
