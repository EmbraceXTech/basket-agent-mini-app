import { IAgentRequest } from "@/interfaces/agent";
import { create } from "zustand";

interface StepperState {
  // stepper
  currentStep: number;
  totalSteps: number;
  canNext: boolean;
  setCanNext: (canNext: boolean) => void;
  isCompleted: () => boolean;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  // form
  data: Partial<IAgentRequest>;
  setData: (data: Partial<IAgentRequest>) => void;
}

const useStepperStore = create<StepperState>((set, get) => ({
  // stepper
  currentStep: 0,
  totalSteps: 5, // Assuming there are 3 steps in the stepper
  canNext: false,
  setCanNext: (canNext: boolean) => set({ canNext }),
  isCompleted: () => {
    return get().currentStep === get().totalSteps - 2;
  },
  nextStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep < state.totalSteps - 1
          ? state.currentStep + 1
          : state.currentStep,
      canNext: false,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep > 0 ? state.currentStep - 1 : state.currentStep,
      canNext: false,
    })),
  setStep: (step: number) =>
    set((state) => ({
      currentStep:
        step >= 0 && step < state.totalSteps ? step : state.currentStep,
    })),
  // form
  data: {},
  setData: (data) =>
    set({
      data: {
        ...get().data,
        ...data,
      },
    }),
}));

export default useStepperStore;
