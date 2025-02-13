export const formatUSD = (value?: number | undefined | null) => {
  if (!value) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatPercent = (value?: number | undefined | null) => {
  if (!value) return "0.00";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const formatNumber = (num: number) => {
  return num >= 1 && num <= 9 ? `0${num}` : `${num}`;
};
