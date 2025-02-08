import Step1 from "./form/Step1";
import Step2 from "./form/Step2";
import Step3 from "./form/Step3";
import Step4 from "./form/Step4";
import Step5 from "./form/Step5";

export default function CreateAgentForm({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div>
      {currentStep === 0 && <Step1 />}
      {currentStep === 1 && <Step2 />}
      {currentStep === 2 && <Step3 />}
      {currentStep === 3 && <Step4 />}
      {currentStep === 4 && <Step5 />}
    </div>
  );
}
