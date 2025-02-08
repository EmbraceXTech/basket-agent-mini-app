export const encodeEthURI = ({
  amount,
  ethAddress,
  chainId,
}: {
  amount?: string;
  ethAddress: string;
  chainId: string;
}) => {
  // Get Bitcoin amount and convert to Wei (assuming 1 BTC = 1 ETH for simplicity)
  const _amount = parseFloat(amount || "0"); // Default to 0 if no amount
  const weiAmount = _amount * 10 ** 18; // Convert ETH to Wei

  // Construct Ethereum URI
  let ethereumURI = `ethereum:${ethAddress}@${chainId}`;
  if (_amount > 0) {
    ethereumURI += `?value=${weiAmount.toFixed(0)}`;
  }

  return ethereumURI;
};
