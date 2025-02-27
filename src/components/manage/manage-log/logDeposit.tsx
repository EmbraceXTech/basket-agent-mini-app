export default function LogDeposit(props: { logData: string }) {
  const { logData } = props;
  const deposit: {
    transactionHash: string;
    amount: number;
    token: string;
    depositDate: string;
    walletAddress: string;
  } = JSON.parse(logData).metadata;
  return (
    <div className="w-full bg-gray-100 rounded-lg p-4">
      <p>Log Type: Deposit</p>
      <hr />
      <p className="text-sm ">{deposit.depositDate}</p>
      <hr />
      <p>Amount:{deposit.amount}</p>
      <hr />
      <p>Token:{deposit.token}</p>
      <hr />
      <p>Transaction Hash:{deposit.transactionHash}</p>
    </div>
  );
}
