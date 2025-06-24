import { toZonedTime } from "date-fns-tz";

export const formatToPhDate = (dateString: string): Date => {
  const date = new Date(dateString);

  return toZonedTime(date, "Asia/Manila");
};
