import Lottie from "lottie-react";

import motionAnimation from "@/assets/motion-successfully.json";

export default function Step5() {
  return (
    <div className="flex-1 flex flex-col space-y-6 justify-center items-center h-full">
      <Lottie
        animationData={motionAnimation}
        loop={false}
        className="w-32 h-32"
      />
      <div className="text-2xl font-medium">Successfully Create</div>
      <p className="text-center text-sm text-gray-500 px-6">
        Create AI Agent for seamless crypto trading and Discover top strategies
        on BaseketAgent.
      </p>
    </div>
  );
}
