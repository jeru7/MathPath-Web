import { type ReactElement } from "react";
import characterMale from "../../../../../assets/gifs/characters/character-boy.gif";
import characterFemale from "../../../../../assets/gifs/characters/character-girl.gif";
import undefinedCharacter from "../../../../../assets/gifs/characters/character-undefined.gif";
import PlayerInfo from "./PlayerInfo";
import { useStudentContext } from "../../../contexts/student.context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlayerCard(): ReactElement {
  const { student } = useStudentContext();
  const character =
    student?.character === "Male"
      ? characterMale
      : student?.character === "Female"
        ? characterFemale
        : undefinedCharacter;

  return (
    <Card className="w-full h-full">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col md:flex-row h-full">
          {/* Character */}
          <div className="md:w-2/5 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border h-full">
            <div className="text-center mb-8">
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <span className="text-primary font-bold">
                  {student?.characterName ?? "No character name"}
                </span>
              </Badge>
            </div>

            <div className="relative">
              <img
                src={character}
                className="h-56 w-38 object-contain"
                alt="character"
              />
            </div>

            {!student?.character && (
              <p className="text-muted-foreground text-xs mt-2 text-center">
                No character selected
              </p>
            )}
          </div>

          {/* Stats Overview */}
          <div className="md:w-3/5 p-4">
            <PlayerInfo />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
