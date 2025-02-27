import { ITokenAvailable } from "@/interfaces/token";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function LogTradePlan(props: {
  logData: string;
  tokenInfo: ITokenAvailable[] | undefined;
}) {
  const { logData, tokenInfo } = props;
  const tradePlan: {
    plan: {
      thoughts: string;
      tradeSteps: {
        data: {
          tokenAddress: string;
          tokenAmount: number;
        };
        reason: string;
        type: "sell" | "buy";
      }[];
    };
    timestamp: string;
  } = JSON.parse(logData);

  return (
    <div className="w-full bg-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800">Trade Plan</h3>
        <span className="text-sm text-gray-500">
          {formatDate(tradePlan.timestamp)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-md p-4 text-gray-700">
          <h4 className="font-medium text-gray-900 mb-2">Thoughts</h4>
          <p className="text-sm leading-relaxed">{tradePlan.plan.thoughts}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Trade Steps</h4>
          <div className="space-y-3">
            {tradePlan.plan.tradeSteps?.map((step, index) => {
              const _tokenInfo = tokenInfo?.find((token) => {
                return (
                  token.address?.toLowerCase() ==
                  step.data.tokenAddress?.toLowerCase()
                );
              });
              return (
                <div
                  key={index}
                  className="bg-white rounded-md p-4 flex items-start space-x-4"
                >
                  <img
                    className="w-12 h-12 rounded-full shadow-sm"
                    src={_tokenInfo?.logoURI}
                    alt={_tokenInfo?.symbol}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          step.type === "buy"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {step.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {_tokenInfo?.symbol} •{" "}
                        {step.data.tokenAmount ? step.data.tokenAmount.toLocaleString(undefined) : 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{step.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
