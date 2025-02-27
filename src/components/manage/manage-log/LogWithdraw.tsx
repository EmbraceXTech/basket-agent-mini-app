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

export default function LogWithdraw(props: {
  logData: string;
  tokenInfo: ITokenAvailable[] | undefined;
}) {
  const { logData, tokenInfo } = props;
  const withdraw: {
    metadata: {
      amount: number;
      token: string;
      transactionHash: string;
      recipientAddress: string;
    };
    timestamp: string;
  } = JSON.parse(logData);

  const _tokenInfo = tokenInfo?.find((token) => {
    return token.symbol == withdraw.metadata.token;
  });

  return (
    <div className="w-full bg-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800">Withdraw</h3>
        <span className="text-sm text-gray-500">
          {formatDate(withdraw.timestamp)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={_tokenInfo?.logoURI}
            alt={_tokenInfo?.symbol}
            className="w-12 h-12 rounded-full shadow-sm"
          />
          <div>
            <div className="text-lg font-medium text-gray-900">
              {withdraw.metadata.amount ? withdraw.metadata.amount.toLocaleString(undefined) : 0}{" "}
              {withdraw.metadata.token}
            </div>
            <div className="text-sm text-gray-500">Amount Withdrawn</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">Transaction Hash:</span>
            <p className="font-mono text-gray-700 break-all">
              {withdraw.metadata.transactionHash}
            </p>
          </div>

          <div className="text-sm">
            <span className="text-gray-500">Recipient Address:</span>
            <p className="font-mono text-gray-700 break-all">
              {withdraw.metadata.recipientAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
