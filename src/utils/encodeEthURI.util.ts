export function generateEIP681URI({
  tokenAddress,
  toAddress,
  amount,
  chainId,
}: {
  tokenAddress: string;
  toAddress: string;
  amount: string;
  chainId: number;
}) {
  if (!tokenAddress || !toAddress || !amount) {
    throw new Error("Missing required parameters");
  }

  const functionSelector = "0xa9059cbb";
  const recipient = toAddress.replace("0x", "").padStart(64, "0");
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  const data = functionSelector + recipient + amountHex;

  return `ethereum:${tokenAddress}/transfer?data=${data}&chainId=${chainId}`;
}

export function generateNativeTokenURI({
  toAddress,
  amount,
  chainId,
}: {
  toAddress: string;
  amount: string;
  chainId: number;
}) {
  if (!toAddress || !amount) {
    throw new Error("Missing required parameters");
  }

  const amountWei = BigInt(parseFloat(amount) * 10 ** 18).toString();

  return `ethereum:${toAddress}?value=${amountWei}&chainId=${chainId}`;
}
