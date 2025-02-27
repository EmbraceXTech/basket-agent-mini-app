export default function LogWithdraw(props: { logData: string }) {
  const { logData } = props;
  const withdraw: {
    metadata: {
      amount: number;
      token: string;
      transactionHash: string;
      recipientAddress: string;
    };
    timestamp: string;
  } = JSON.parse(logData);
  return (
    <div className="w-full bg-gray-100 rounded-lg p-4">
      <p>Log Type: Withdraw</p>
      <hr />
      <p className="text-sm ">{withdraw.timestamp}</p>
      <hr />
      <p>Amount: {withdraw.metadata.amount}</p>
      <hr />
      <p>Token: {withdraw.metadata.token}</p>
      <hr />
      <p>Transaction Hash: {withdraw.metadata.transactionHash}</p>
      <hr />
      <p>Recipient Address: {withdraw.metadata.recipientAddress}</p>
    </div>
  );
}
