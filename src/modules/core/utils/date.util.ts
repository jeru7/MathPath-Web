import { format } from "date-fns-tz";
import { TIMEZONE } from "../constants/date.constant";

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

export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a", {
      timeZone: TIMEZONE,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};
