import { type ReactElement } from "react";
import chestIcon from "../../../../../assets/icons/chestIcon.png";
import { IQuestProgress } from "../../../../../types/student.type";

export default function QuestChests({
  questData,
}: {
  questData: IQuestProgress | undefined;
}): ReactElement {
  return (
    <article className="w-full py-2 h-10 flex items-center">
      {/* Progress line */}
      <div className="w-full h-2 rounded-full bg-[var(--secondary-orange)] relative">
        {/* Progress Fill */}
        <div className="h-full bg-[var(--primary-orange)] rounded-full w-[50%]"></div>

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
