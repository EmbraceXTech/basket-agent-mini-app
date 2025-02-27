export default function LogTradeError(props: { logData: string }) {
  const { logData } = props;
  const tradeError: {
    error: {
      message: string;
    };
    timestamp: string;
  } = JSON.parse(logData);
  return (
    <div className="w-full bg-gray-100 rounded-lg p-4">
      <p>Log Type: Trade Error</p>
      <hr />
      <p className="text-sm ">{tradeError.timestamp}</p>
      <hr />
      <p>{tradeError?.error?.message || "No error message"}</p>
    </div>
  );
}
