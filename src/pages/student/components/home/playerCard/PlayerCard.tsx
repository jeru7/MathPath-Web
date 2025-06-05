import { type ReactElement } from "react";
import mainBackground from "../../../../../assets/backgroundImage/mainBackground.png";
import characterMale from "../../../../../assets/gifs/characterBoy.gif";
import characterFemale from "../../../../../assets/gifs/characterGirl.gif";
import PlayerInfo from "./PlayerInfo";
import { useStudentContext } from "../../../../../hooks/useStudent";

export default function PlayerCard({
  studentId,
}: {
  studentId: string;
}): ReactElement {
  const { student } = useStudentContext();
  const character =
    student?.character === "male" ? characterMale : characterFemale;
  return (
    <section
      className="w-[70%] h-full bg-white bg-cover bg-center rounded-md drop-shadow-sm p-2 relative flex justify-center gap-24"
      style={{ backgroundImage: `url(${mainBackground})` }}
    >
      {/* Overlay for vignette effect */}
      <div
        className="absolute inset-0 from-transparent via-transparent to-black opacity-80 rounded-md z-10"
        style={{ background: "var(--vignette-gradient)" }}
      ></div>

      {/* Player game info */}
      <PlayerInfo studentId={studentId} />

      {/* Player character display */}
      <article className="flex justify-center items-end w-fit pb-8">
        <img src={character} alt="character gif" />
      </article>
    </section>
  );
}
