import { type ReactElement } from "react";
import starIcon from "../../../../../assets/icons/starIcon.png";
import pawIcon from "../../../../../assets/icons/pawIcon.png";
import bookIcon from "../../../../../assets/icons/bookIcon.png";
import bagIcon from "../../../../../assets/icons/bagIcon.png";
import crownIcon from "../../../../../assets/icons/crownIcon.png";
import trophyIcon from "../../../../../assets/icons/trophyIcon.png";
import skullIcon from "../../../../../assets/icons/skullIcon.png";
import {
  QuestListItem,
  QuestType,
} from "../../../../core/types/quest/quest.types";

export default function QuestItem({
  quest,
}: {
  quest: QuestListItem;
}): ReactElement {
  // quest progress percentage
  const questProgressPercentage = Math.round(
    (quest.reqCompleted / quest.req) * 100,
  );

  // return icon path based on the quest type
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
    <article className="flex flex-col items-center px-3 py-5 rounded-lg gap-4 drop-shadow-sm bg-white">
      {/* Quest icon */}
      <img src={displayIcon(quest.type)} alt="" className="h-16 w-16" />

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          {/* Quest name and claim indicator */}
          <p className="font-semibold text-md text-center h-12">{quest.name}</p>
          <p className="text-xs text-gray-400">
            {quest.claimed ? "Claimed" : "Not claimed yet"}
          </p>
        </div>
      </div>

      <div className="w-full flex gap-1 items-center">
        {/* Quest progress bar */}
        <div className="w-full rounded-full bg-gray-200 h-2">
          {/* Fill */}
          <div
            className="h-full bg-[var(--primary-green)] rounded-full w-full"
            style={{
              backgroundColor: `${questProgressPercentage === 100 ? "var(--primary-green)" : "var(--secnodary-green)"}`,
              width: `${questProgressPercentage}%`,
            }}
          ></div>
        </div>

        {/* Completed counter */}
        <div className="text-xs text-gray-400">
          {quest.reqCompleted}/{quest.req}
        </div>
      </div>
    </article>
  );
}
