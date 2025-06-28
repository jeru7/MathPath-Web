import { type ReactElement } from "react";

import levelIcon from "../../../../../assets/icons/starIcon.png";
import hourglassIcon from "../../../../../assets/icons/hourglassIcon.png";
import skullIcon from "../../../../../assets/icons/skullIcon.png";
import trophyIcon from "../../../../../assets/icons/trophyIcon.png";
import loseIcon from "../../../../../assets/icons/loseIcon.png";
import skillIcon from "../../../../../assets/icons/skillIcon.png";
import { useStudentContext } from "../../../hooks/useStudent";
import { useStudentPlayerCard } from "../../../hooks/useStudentStats";

export default function PlayerInfo({
  studentId,
}: {
  studentId: string;
}): ReactElement {
  const { data: playerCardStats } = useStudentPlayerCard(studentId);
  const { student } = useStudentContext();
  return (
    <article className="flex flex-col items-center justify-center w-90 h-full gap-4 font-jersey z-20">
      <p className="text-5xl text-white font-bold pb-1 border-b-white border-b-2 w-full text-center">
        {student?.characterName ?? "???"}
      </p>
      <div className="flex gap-2 items-center w-full border-b pb-1 border-b-white/50">
        <img src={levelIcon} alt="Level Icon" className="w-8 h-8" />
        <p className="text-white font-semibold text-xl">
          Level: {playerCardStats?.playerLevel ?? "???"}
        </p>
      </div>
      <div className="flex gap-2 items-center w-full border-b pb-1 border-b-white/50">
        <img src={hourglassIcon} alt="Hourglass Icon" className="w-8 h-8" />
        <p className="text-white font-semibold text-xl">
          Total Playtime:{" "}
          {playerCardStats?.totalPlaytime
            ? "???"
            : `${playerCardStats?.totalPlaytime}hrs`}
        </p>
      </div>
      <div className="flex gap-2 items-center w-full border-b pb-1 border-b-white/50">
        <img src={skullIcon} alt="Hourglass Icon" className="w-8 h-8" />
        <p className="text-white font-semibold text-xl">
          Completed Stages: {playerCardStats?.completedStagesCount ?? "???"}
        </p>
      </div>
      <div className="flex gap-2 items-center w-full border-b pb-1 border-b-white/50">
        <img src={trophyIcon} alt="Trophy Icon" className="w-8 h-8" />
        <p className="text-white font-semibold text-xl">
          Most Played Stage: {playerCardStats?.mostPlayedStage ?? "???"}
        </p>
      </div>
      <div className="flex gap-2 items-center w-full border-b pb-1 border-b-white/50">
        <img src={loseIcon} alt="Lose Icon" className="w-8 h-8" />
        <p className="text-white font-semibold text-xl">
          Most Failed Stage: {playerCardStats?.mostFailedStage ?? "???"}
        </p>
      </div>
      <div className="flex gap-2 items-center w-full border-b pb-1 border-b-white/50">
        <img src={skillIcon} alt="Skill Icon" className="w-8 h-8" />
        <p className="text-white font-semibold text-xl">
          Most Used Skill: {playerCardStats?.mostUsedSkill ?? "???"}
        </p>
      </div>
    </article>
  );
}
