import { useNavigate } from "react-router-dom";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/react";
import { useState } from "react";
import toast from "react-hot-toast";

import useStepperStore from "@/stores/createAgent.store";
import agentApi from "@/services/agent.service";
import { IAgentRequest } from "@/interfaces/agent.d";

import { Page } from "@/components/base/Page";
import CreateAgentForm from "@/components/agent/CreateAgentForm";
import Header from "@/components/layout/Header";

export default function CreatePage() {
  const navigate = useNavigate();
  const { currentStep, setStep, totalSteps, nextStep, canNext, data, setData } =
    useStepperStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const agent = await agentApi.createAgent(data as IAgentRequest);
      // console.log('create data:', data);
      setData({ id: agent.id });
      nextStep();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create agent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page
      back={true}
      onBack={() =>
        currentStep > 0
          ? setStep(currentStep - 1)
          : navigate("/")
      }
    >
      <div className="w-full h-screen p-4 flex flex-col">
        {currentStep !== totalSteps - 2 && currentStep !== totalSteps - 1 ? (
          <Progress
            value={currentStep + 1}
            maxValue={totalSteps - 1}
            showValueLabel={false}
            color="primary"
            size="sm"
            className="mb-4 max-w-[10rem] mx-auto"
          />
        ) : currentStep === totalSteps - 1 ? (
          <Header title="Deposit USDC/ETH to Your Wallet" />
        ) : (
          <div />
        )}
        <div className="flex-1">
          <div className="w-full flex justify-center"></div>
          <CreateAgentForm currentStep={currentStep} />
        </div>
        <div className="mt-4 pb-4">
          {currentStep < totalSteps - 3 ? (
            <Button
              className="w-full bg-[#FF4F29] text-white rounded-full font-medium"
              onPress={nextStep}
              isDisabled={!canNext}
            >
              Next
            </Button>
          ) : currentStep === totalSteps - 2 ? (
            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-[#FF4F29] text-white rounded-full font-medium"
                onPress={() => nextStep()}
              >
                Deposit Now
              </Button>
              <Button
                className="w-full bg-secondary-background text-secondary rounded-full font-medium"
                onPress={() => navigate("/")}
              >
                Deposit Later
              </Button>
            </div>
          ) : currentStep === totalSteps - 1 ? (
            <div>
              <Button
                className="w-full bg-[#FF4F29] text-secondary rounded-full font-medium"
                onPress={() => navigate("/")}
              >
                Finish
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-[#FF4F29] text-white rounded-full font-medium"
              onPress={handleCreate}
              isDisabled={isLoading}
              isLoading={isLoading}
            >
              Create Agent
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
}
