export default function LogTradePlan(props: { logData: string }) {
  const { logData } = props;
  const tradePlan: {
    plan: {
      thoughts: string;
      tradeSteps: {
        tokenAddress: string;
        tokenAmount: number;
        reason: string;
        type: "sell" | "buy";
      }[];
    };
    timestamp: string;
  } = JSON.parse(logData);
  // console.log({ tradePlan });
  return (
    <div className="w-full bg-gray-100 rounded-lg p-4">
      <p>Log Type: Trade Plan</p>
      <hr />
      <p className="text-sm ">{tradePlan.timestamp}</p>
      <hr />
      <p>{tradePlan.plan.thoughts}</p>
      <hr />
      <p>Steps:</p>
      <div className="flex flex-col space-y-2">
        {tradePlan.plan.tradeSteps?.map((step, index) => (
          <div key={index}>{step.reason}</div>
        ))}
      </div>
    </div>
  );
}
