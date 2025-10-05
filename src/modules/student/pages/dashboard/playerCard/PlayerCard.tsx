import { type ReactElement } from "react";
import characterMale from "../../../../../assets/gifs/characters/character-boy.gif";
import characterFemale from "../../../../../assets/gifs/characters/character-girl.gif";
import undefinedCharacter from "../../../../../assets/gifs/characters/character-undefined.gif";
import PlayerInfo from "./PlayerInfo";
import { useStudentContext } from "../../../contexts/student.context";

export default function PlayerCard(): ReactElement {
  const { student } = useStudentContext();
  const character =
    student?.character === "Male"
      ? characterMale
      : student?.character === "Female"
        ? characterFemale
        : undefinedCharacter;

  return (
    <section className="w-full h-full bg-white rounded-sm p-3 shadow-sm">
      <div className="flex flex-col md:flex-row h-full">
        {/* character */}
        <div className="md:w-2/5 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 h-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300 text-sm">
              <span className="text-[var(--primary-green)] font-bold">
                {student?.characterName ?? "No character name"}
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src={character}
              className="h-56 w-38 object-contain"
              alt="character"
            />
          </div>

          {!student?.character && (
            <p className="text-gray-500 text-xs mt-2 text-center">
              No character selected
            </p>
          )}
        </div>

        {/* stats overview */}
        <div className="md:w-3/5 p-4">
          <PlayerInfo />
        </div>
      </div>
    </section>
  );
}
