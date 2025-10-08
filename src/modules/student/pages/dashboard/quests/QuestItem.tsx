import { type ReactElement } from "react";
import starIcon from "../../../../../assets/icons/star.png";
import pawIcon from "../../../../../assets/icons/paw.png";
import bookIcon from "../../../../../assets/icons/book.png";
import bagIcon from "../../../../../assets/icons/bag.png";
import crownIcon from "../../../../../assets/icons/crown.png";
import trophyIcon from "../../../../../assets/icons/trophy.png";
import skullIcon from "../../../../../assets/icons/skull.png";
import {
  QuestListItem,
  QuestType,
} from "../../../../core/types/quest/quest.type";

export default function QuestItem({
  quest,
}: {
  quest: QuestListItem;
}): ReactElement {
  const questProgressPercentage = Math.round(
    (quest.reqCompleted / quest.req) * 100,
  );
  const isCompleted = questProgressPercentage === 100;
  const isClaimed = quest.claimed;

  const displayIcon = (questType: QuestType) => {
    switch (questType) {
      case "Item":
        return bagIcon;
      case "Sunny":
        return pawIcon;
      case "Monster":
        return skullIcon;
      case "MagicBook":
        return bookIcon;
      case "Level":
        return starIcon;
      case "Stage":
        return trophyIcon;
      case "Skill":
        return crownIcon;
      case "Shop":
        return bagIcon;
    }
  };

  return (
    <div
      className={`p-3 rounded border h-fit transition-colors duration-200 ${
        isCompleted
          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30"
          : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
      } flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2">
        <img
          src={displayIcon(quest.type)}
          alt=""
          className="h-8 w-8 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate transition-colors duration-200">
            {quest.name}
          </p>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs transition-colors duration-200 ${
                isClaimed
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {isClaimed ? "Claimed" : "In Progress"}
            </span>
            {isCompleted && !isClaimed && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium transition-colors duration-200">
                • Ready to claim
              </span>
            )}
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 transition-colors duration-200">
          <div
            className={`h-full rounded-full transition-colors duration-200 ${
              isCompleted
                ? "bg-green-500 dark:bg-green-400"
                : "bg-blue-500 dark:bg-blue-400"
            }`}
            style={{ width: `${questProgressPercentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium min-w-10 text-right transition-colors duration-200">
          {quest.reqCompleted}/{quest.req}
        </span>
      </div>
    </div>
  );
}
