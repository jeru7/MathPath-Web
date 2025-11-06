import { type ReactElement } from "react";
import chestIcon from "../../../../../assets/icons/chest.png";
import { QuestList } from "../../../../core/types/quest/quest.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuestChests({
  quest,
}: {
  quest: QuestList | undefined;
}): ReactElement {
  const percentage = quest?.percentage ?? 0;

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        <div className="relative">
          {/* Fill Container */}
          <div className="w-full h-2 rounded-full bg-muted">
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="absolute top-0 w-full h-full">
            {/* First Chest */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 ${percentage >= 25 ? "scale-110" : "scale-100 opacity-60"
                } transition-transform duration-200`}
              style={{ left: "25%" }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={chestIcon}
                  alt="Chest 1"
                  className="h-6 w-6 drop-shadow-sm"
                />
                <span className="text-[10px] text-muted-foreground font-medium mt-1">
                  25%
                </span>
              </div>
              {percentage >= 25 && (
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-green-500 border-white" />
              )}
            </div>

            {/* Second Chest */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 ${percentage >= 50 ? "scale-110" : "scale-100 opacity-60"
                } transition-transform duration-200`}
              style={{ left: "50%" }}
            >
              <div className="flex flex-col items-center">
                <img
                  src={chestIcon}
                  alt="Chest 2"
                  className="h-6 w-6 drop-shadow-sm"
                />
                <span className="text-[10px] text-muted-foreground font-medium mt-1">
                  50%
                </span>
              </div>
              {percentage >= 50 && (
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-green-500 border-white" />
              )}
            </div>

            {/* Third Chest */}
            <div
              className={`absolute top-1/2 transform -translate-y-1/2 ${percentage >= 100 ? "scale-110" : "scale-100 opacity-60"
                } transition-transform duration-200`}
              style={{ left: "100%" }}
            >
              <div className="flex flex-col items-center -translate-x-1/2">
                <img
                  src={chestIcon}
                  alt="Chest 3"
                  className="h-6 w-6 drop-shadow-sm"
                />
                <span className="text-[10px] text-muted-foreground font-medium mt-1">
                  100%
                </span>
              </div>
              {percentage >= 100 && (
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-green-500 border-white" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
