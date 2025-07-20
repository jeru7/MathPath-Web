import { type ReactElement } from "react";

import levelIcon from "../../../../../assets/icons/star.png";
import hourglassIcon from "../../../../../assets/icons/hourglass.png";
import skullIcon from "../../../../../assets/icons/skull.png";
import trophyIcon from "../../../../../assets/icons/trophy.png";
import loseIcon from "../../../../../assets/icons/lose.png";
import skillIcon from "../../../../../assets/icons/skill.png";
import { useStudentPlayerCard } from "../../../services/student-stats.service";
import { useStudentContext } from "../../../contexts/student.context";

export default function PlayerInfo({
  studentId,
}: {
  studentId: string;
}): ReactElement {
  const { student } = useStudentContext();
  const { data: playerCardStats } = useStudentPlayerCard(studentId);
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
