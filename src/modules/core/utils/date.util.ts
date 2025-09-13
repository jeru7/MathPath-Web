import { toZonedTime } from "date-fns-tz";

export const formatHour = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
};

export const getMonthName = (monthNumber: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1];
};

export const formatToPhDate = (dateString: string): Date => {
  const date = new Date(dateString);

  return toZonedTime(date, "Asia/Manila");
};
