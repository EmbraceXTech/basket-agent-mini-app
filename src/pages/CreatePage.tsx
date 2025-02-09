import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import useStepperStore from "@/stores/createAgent.store";
import { IAgentRequest } from "@/interfaces/agent";
import agentApi from "@/services/agent.service";

import { Page } from "@/components/base/Page";
import CreateAgentForm from "@/components/agent/CreateAgentForm";
import CreateAgentHeader from "@/components/agent/CreateAgentHeader";

export default function CreatePage() {
  const navigator = useNavigate();
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    isCompleted,
    data,
    canNext,
  } = useStepperStore();

  const handleCreate = async () => {
    try {
      const response = await agentApi.createAgent(data as IAgentRequest);
      console.log(response);
      nextStep();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page back={false} onBack={currentStep > 0 ? prevStep : undefined}>
      <div className="w-full h-screen p-4 flex flex-col">
        <CreateAgentHeader currentStep={currentStep} />
        <div className="flex-1">
          <CreateAgentForm currentStep={currentStep} />
        </div>
        {isCompleted() ? (
          <Button
            className="rounded-full text-white"
            variant="solid"
            color="primary"
            onPress={handleCreate}
            isDisabled={!canNext}
          >
            Create
          </Button>
        ) : currentStep === totalSteps - 1 ? (
          <>
            <Button
              className="rounded-full text-white"
              variant="solid"
              color="primary"
              onPress={() => navigator("/")}
            >
              Done
            </Button>
          </>
        ) : (
          <Button
            className="rounded-full text-white"
            variant="solid"
            color="primary"
            onPress={nextStep}
            isDisabled={!canNext}
          >
            Next
          </Button>
        )}
      </div>
    </Page>
  );
}
