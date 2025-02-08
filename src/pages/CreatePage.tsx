import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

import useStepperStore from "@/stores/createAgent.store";
import { IAgentRequest } from "@/interfaces/agent";
import { createAgent } from "@/services/agent.service";

import { Page } from "@/components/base/Page";
import CreateAgentForm from "@/components/agent/CreateAgentForm";
import CreateAgentHeader from "@/components/agent/CreateAgentHeader";

export default function CreatePage() {
  const navigator = useNavigate();
  const { currentStep, totalSteps, nextStep, prevStep, isCompleted, data } =
    useStepperStore();

  const handleCreate = async () => {
    try {
      const response = await createAgent(data as IAgentRequest);
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
            className="bg-blue-500 rounded-full text-white"
            variant="solid"
            onPress={handleCreate}
          >
            Create
          </Button>
        ) : currentStep === totalSteps - 1 ? (
          <>
            <Button
              className="bg-blue-500 rounded-full text-white"
              variant="solid"
              onPress={() => navigator("/")}
            >
              Done
            </Button>
          </>
        ) : (
          <Button
            className="bg-blue-500 rounded-full text-white"
            variant="solid"
            onPress={nextStep}
          >
            Next
          </Button>
        )}
      </div>
    </Page>
  );
}
