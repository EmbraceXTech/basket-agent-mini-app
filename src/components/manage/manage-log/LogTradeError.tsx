const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function LogTradeError(props: { logData: string }) {
  const { logData } = props;
  const tradeError: {
    error: {
      message: string;
    };
    timestamp: string;
  } = JSON.parse(logData);
  return (
    <div className="w-full bg-gray-100 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-lg text-red-600">Trade Error</h3>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(tradeError.timestamp)}
        </span>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-md p-4">
        <p className="text-sm text-red-700 leading-relaxed break-words">
          {tradeError?.error?.message || "No error message"}
        </p>
      </div>
    </div>
  );
}
