import { useNavigate } from "react-router-dom";
import { Progress } from "@heroui/progress";
import { Button } from "@heroui/react";

import useStepperStore from "@/stores/createAgent.store";
import agentApi from "@/services/agent.service";
import { IAgentRequest } from "@/interfaces/agent.d";

import { Page } from "@/components/base/Page";
import CreateAgentForm from "@/components/agent/CreateAgentForm";

export default function CreatePage() {
  const navigate = useNavigate();
  const { currentStep, setStep, totalSteps, nextStep, canNext, data } =
    useStepperStore();

  const handleCreate = async () => {
    try {
      await agentApi.createAgent(data as IAgentRequest);
      nextStep();
    } catch (error) {
      console.error(error);
    }
  };

  // const renderStep = () => {
  //   switch (currentStep) {
  //     case 0:
  //       return (
  //         <div className="space-y-4">
  //           <h2 className="text-lg font-medium">Select Tokens</h2>
  //           <Select
  //             items={availableTokens}
  //             className="overflow-x-auto"
  //             aria-label="Select tokens"
  //             selectionMode="multiple"
  //             selectedKeys={new Set(formData.selectedTokens)}
  //             placeholder="Select tokens"
  //             onSelectionChange={handleTokenSelection}
  //             renderValue={(items) => {
  //               return (
  //                 <div className="flex gap-2 overflow-x-auto">
  //                   {items.map((item) => (
  //                     <div key={item.key} className="flex items-center gap-2">
  //                       <div className="w-8 h-6">
  //                         <img
  //                           className="w-6 h-6"
  //                           src={item.data.imageUrl}
  //                           alt={item.data.symbol}
  //                         />
  //                       </div>
  //                       <div className="w-full">{item.data.symbol}</div>
  //                     </div>
  //                   ))}
  //                 </div>
  //               );
  //             }}
  //           >
  //             {(token) => (
  //               <SelectItem
  //                 key={token.address}
  //                 textValue={token.symbol}
  //                 startContent={
  //                   <img
  //                     src={token.imageUrl}
  //                     alt={token.symbol}
  //                     className="w-6 h-6"
  //                   />
  //                 }
  //               >
  //                 {token.symbol}
  //               </SelectItem>
  //             )}
  //           </Select>
  //         </div>
  //       );

  //     case 1:
  //       return (
  //         <div className="space-y-4">
  //           <h2 className="text-lg font-medium">Trading Strategy</h2>
  //           <Select
  //             label="Select strategy template"
  //             selectedKeys={[selectedStrategy]}
  //             onChange={(e) => handleStrategyChange(e.target.value)}
  //           >
  //             {PRESET_STRATEGIES.map((strategy) => (
  //               <SelectItem key={strategy.id} value={strategy.id.toString()}>
  //                 {strategy.name}
  //               </SelectItem>
  //             ))}
  //           </Select>
  //           <Textarea
  //             label="Strategy Prompt"
  //             placeholder="Describe your trading strategy..."
  //             value={formData.strategy}
  //             onChange={(e) =>
  //               setFormData((prev) => ({ ...prev, strategy: e.target.value }))
  //             }
  //             className="min-h-[200px]"
  //           />
  //         </div>
  //       );

  //     case 2:
  //       return (
  //         <div className="space-y-4">
  //           <div className="flex justify-between items-center">
  //             <h2 className="text-lg font-medium">Knowledge Base</h2>
  //             <Button size="sm" variant="light" onPress={handleAddKnowledge}>
  //               Add Knowledge
  //             </Button>
  //           </div>
  //           <div className="space-y-4">
  //             {formData.knowledge.map((item) => (
  //               <div
  //                 key={item.id}
  //                 className="p-4 bg-gray-50 rounded-lg space-y-2"
  //               >
  //                 <div className="flex justify-between">
  //                   <Input
  //                     placeholder="Knowledge name"
  //                     value={item.name}
  //                     onChange={(e) =>
  //                       handleKnowledgeChange(item.id, "name", e.target.value)
  //                     }
  //                   />
  //                   <Button
  //                     size="sm"
  //                     color="danger"
  //                     variant="light"
  //                     onPress={() => handleDeleteKnowledge(item.id)}
  //                   >
  //                     Delete
  //                   </Button>
  //                 </div>
  //                 <Textarea
  //                   placeholder="Knowledge content"
  //                   value={item.content}
  //                   onChange={(e) =>
  //                     handleKnowledgeChange(item.id, "content", e.target.value)
  //                   }
  //                 />
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       );

  //     case 3:
  //       return (
  //         <div className="space-y-4">
  //           <h2 className="text-lg font-medium">Trading Settings</h2>
  //           <div className="flex gap-2">
  //             <Input
  //               type="number"
  //               label="Interval"
  //               value={formData.interval}
  //               onChange={(e) =>
  //                 setFormData((prev) => ({ ...prev, interval: e.target.value }))
  //               }
  //             />
  //             <Select
  //               label="Unit"
  //               selectedKeys={[formData.intervalUnit]}
  //               onChange={(e) =>
  //                 setFormData((prev) => ({
  //                   ...prev,
  //                   intervalUnit: e.target.value,
  //                 }))
  //               }
  //             >
  //               <SelectItem key="minute" value="minute">
  //                 Minutes
  //               </SelectItem>
  //               <SelectItem key="hour" value="hour">
  //                 Hours
  //               </SelectItem>
  //               <SelectItem key="day" value="day">
  //                 Days
  //               </SelectItem>
  //             </Select>
  //           </div>
  //           <Input
  //             type="datetime-local"
  //             label="End Date (Optional)"
  //             onChange={(e) =>
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 endDate: e.target.value ? new Date(e.target.value) : null,
  //               }))
  //             }
  //           />
  //         </div>
  //       );

  //     default:
  //       return null;
  //   }
  // };

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
            >
              Create Agent
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
}
