import { ActivityTypes } from "../../../../core/types/activity/activity.type";

export const getActivityKeyword = (type: ActivityTypes) => {
  switch (type) {
    case "stage":
    case "badge":
      return "unlocked";
    case "level":
      return "leveled up to";
    case "assessment":
      return "completed";
  }
};
