export type OnlineTrendRange = "today" | "7d" | "2w";

export type OnlineTrendResultToday = {
  hour: number;
  onlineCount: number;
};

export type OnlineTrendResultDay = {
  date: {
    year: number;
    month: number;
    day: number;
  };
  onlineCount: number;
};
