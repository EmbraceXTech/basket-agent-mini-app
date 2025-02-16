import { useNavigate } from "react-router-dom";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/react";
import { useState } from "react";

import useStepperStore from "@/stores/createAgent.store";
import agentApi from "@/services/agent.service";
import { IAgentRequest } from "@/interfaces/agent.d";

import { Page } from "@/components/base/Page";
import CreateAgentForm from "@/components/agent/CreateAgentForm";

export default function CreatePage() {
  const navigate = useNavigate();
  const { currentStep, setStep, totalSteps, nextStep, canNext, data } =
    useStepperStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await agentApi.createAgent(data as IAgentRequest);
      // console.log('create data:', data);
      nextStep();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page
      back={true}
      onBack={() => currentStep > 0 && setStep(currentStep - 1)}
    >
      <div className="w-full h-screen p-4 flex flex-col">
        {currentStep !== totalSteps - 1 && (
          <Progress
            value={currentStep + 1}
            maxValue={totalSteps}
            showValueLabel={false}
            color="primary"
            size="sm"
            className="mb-4 max-w-[10rem] mx-auto"
          />
        )}
        <div className="flex-1">
          <div className="w-full flex justify-center">
          </div>
          <CreateAgentForm currentStep={currentStep} />
        </div>
        <div className="mt-4">
          {currentStep < totalSteps - 2 ? (
            <Button
              className="w-full bg-[#FF4F29] text-white rounded-full font-medium"
              onPress={nextStep}
              isDisabled={!canNext}
            >
              Next
            </Button>
          ) : currentStep === totalSteps - 1 ? (
            <>
              <Button
                className="w-full bg-[#FF4F29] text-white rounded-full font-medium"
                onPress={() => navigate("/")}
              >
                Done
              </Button>
            </>
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
