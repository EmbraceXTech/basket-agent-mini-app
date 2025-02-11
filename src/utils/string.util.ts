export const truncateAddress = (
  address: string,
  {
    prefixLength = 6,
    suffixLength = 4,
  }: {
    prefixLength?: number;
    suffixLength?: number;
  } = {}
) => {
  return (
    address.slice(0, prefixLength) + "..." + address.slice(-suffixLength)
  );
};
