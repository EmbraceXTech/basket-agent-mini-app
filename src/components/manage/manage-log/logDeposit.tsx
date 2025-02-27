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

export default function LogDeposit(props: {
  logData: string;
  tokenInfo: ITokenAvailable[] | undefined;
}) {
  const { logData, tokenInfo } = props;
  const deposit: {
    transactionHash: string;
    amount: number;
    token: string;
    depositDate: string;
    walletAddress: string;
  } = JSON.parse(logData).metadata;

  const _tokenInfo = tokenInfo?.find((token) => {
    return token.symbol == deposit.token;
  });

  return (
    <div className="w-full bg-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800">Deposit</h3>
        <span className="text-sm text-gray-500">
          {formatDate(deposit.depositDate)}
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
              {deposit.amount ? deposit.amount.toLocaleString(undefined) : 0}{" "}
              {deposit.token}
            </div>
            <div className="text-sm text-gray-500">Amount Deposited</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">Transaction Hash:</span>
            <p className="font-mono text-gray-700 break-all">
              {deposit.transactionHash}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
