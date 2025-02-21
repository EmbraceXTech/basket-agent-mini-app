/**
 * Generates an ERC-681 URI string for Ethereum transactions.
 *
 * Supports:
 * - Native ETH transfers (`ethereum:<address>@<chainId>?value=<amount>`)
 * - ERC-20 token transfers (`ethereum:<contract>@<chainId>/transfer?address=<recipient>&uint256=<amount>`)
 *
 * @param to - Recipient address (for ETH) or contract address (for ERC-20).
 * @param chainId - Ethereum chain ID (in decimal).
 * @param amount - Amount to transfer (as a string to handle decimals correctly).
 * @param isErc20 - If `true`, treats `to` as an ERC-20 contract and requires `recipient` address.
 * @param recipient - Required if `isErc20` is `true` (recipient of ERC-20 tokens).
 * @returns The ERC-681 formatted URI.
 */
export function generateErc681({
  to,
  chainId,
  amount,
  isErc20,
  recipient,
}: {
  to: string;
  chainId: number;
  amount?: string;
  isErc20: boolean;
  recipient?: string;
}): string {
  // Convert chainId to hexadecimal format
  const chainIdHex = `0x${chainId.toString(16)}`;

  // Start with the base URI
  let uri = `ethereum:${to}@${chainIdHex}`;

  if (isErc20) {
    // ERC-20 Token Transfer
    if (!recipient) {
      throw new Error("Recipient address is required for ERC-20 transfers.");
    }
    uri += `/transfer?address=${recipient}${
      amount ? `&uint256=${encodeURIComponent(amount)}` : "&uint256="
    }`;
  } else {
    // Native ETH Transfer
    uri += `?value=${amount ? encodeURIComponent(amount) : ""}`;
  }

  return uri;
}
