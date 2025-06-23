import { type ReactElement } from "react";
import mainBackground from "../../../../../assets/backgroundImage/mainBackground.png";
import characterMale from "../../../../../assets/gifs/characterBoy.gif";
import characterFemale from "../../../../../assets/gifs/characterGirl.gif";
import undefinedCharacter from "../../../../../assets/gifs/characterUndefined.gif";
import PlayerInfo from "./PlayerInfo";
import { useStudentContext } from "../../../../../hooks/useStudent";

export default function PlayerCard({
  studentId,
}: {
  studentId: string;
}): ReactElement {
  const { student } = useStudentContext();
  const character =
    student?.character === "Male"
      ? characterMale
      : student?.character === "Female"
        ? characterFemale
        : undefinedCharacter;
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
      <article
        className={`flex justify-center items-end w-56 ${student?.character ? "pb-8" : "pb-24"}`}
      >
        <img
          src={character}
          className="h-72 w-56 border-amber-100"
          alt="character gif"
          style={{
            width: !student?.character ? "120px" : "",
            height: !student?.character ? "200px" : "",
          }}
        />
      </article>
    </section>
  );
}
