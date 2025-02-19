export const toLocalDate = (date: Date): Date => {
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate;
};

export const toUTCDate = (date: Date): Date => {
  const utcDate = new Date(date);
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
};

export const formatDateOnly = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
