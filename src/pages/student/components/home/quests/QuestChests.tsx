import { type ReactElement } from "react";
import chestIcon from "../../../../../assets/icons/chestIcon.png";
import { QuestList } from "../../../../../types/quest/quest.types";

export default function QuestChests({
  quest,
}: {
  quest: QuestList | undefined;
}): ReactElement {
  return (
    <article className="w-full py-2 h-12 flex items-center absolute top-0 inset-0">
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-[var(--secondary-orange)] relative">
        {/* Progress Fill */}
        <div
          className="h-full bg-[var(--primary-orange)] rounded-full"
          style={{ width: `${quest?.questChestPercentage}%` }}
        ></div>

        {/* Quest chests */}
        <div className="w-full flex items-center justify-around absolute inset-0 top-0">
          <div
            className="rounded-md h-10 w-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${chestIcon})` }}
          ></div>
          <div
            className="rounded-md h-10 w-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${chestIcon})` }}
          ></div>
          <div
            className="rounded-md h-10 w-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${chestIcon})` }}
          ></div>
        </div>
      </div>
    </article>
  );
}
