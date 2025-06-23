export const convertToPhilippinesDate = (dateString: string): Date => {
  const date = new Date(dateString);

  const philippinesTime = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );

  return philippinesTime;
};
