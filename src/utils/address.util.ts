/**
 * Validates if a string is a valid Ethereum address
 * @param address The address to validate
 * @returns boolean indicating if address is valid
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address) return false;
  
  // Check if address matches basic Ethereum address format
  // Should be 42 characters long, start with 0x, and contain only hex characters
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumAddressRegex.test(address);
}
