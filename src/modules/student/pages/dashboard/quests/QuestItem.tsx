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
      className={`p-3 rounded border ${
        isCompleted
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-gray-50"
      } flex flex-col gap-2`}
    >
      <div className="flex items-center gap-2">
        <img
          src={displayIcon(quest.type)}
          alt=""
          className="h-8 w-8 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">
            {quest.name}
          </p>
          <div className="flex items-center gap-1">
            <span
              className={`text-xs ${
                isClaimed ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isClaimed ? "Claimed" : "In Progress"}
            </span>
            {isCompleted && !isClaimed && (
              <span className="text-xs text-amber-600 font-medium">
                • Ready to claim
              </span>
            )}
          </div>
        </div>
      </div>

      {/* progress bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-full rounded-full ${
              isCompleted ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${questProgressPercentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-500 font-medium min-w-10 text-right">
          {quest.reqCompleted}/{quest.req}
        </span>
      </div>
    </div>
  );
}
