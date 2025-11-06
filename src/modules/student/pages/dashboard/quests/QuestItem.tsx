import { type ReactElement } from "react";
import starIcon from "../../../../../assets/icons/star.png";
import pawIcon from "../../../../../assets/icons/paw.png";
import bookIcon from "../../../../../assets/icons/book.png";
import bagIcon from "../../../../../assets/icons/bag.png";
import crownIcon from "../../../../../assets/icons/crown.png";
import trophyIcon from "../../../../../assets/icons/trophy.png";
import skullIcon from "../../../../../assets/icons/skull.png";
import {
  QuestListItem,
  QuestType,
} from "../../../../core/types/quest/quest.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function QuestItem({
  quest,
}: {
  quest: QuestListItem;
}): ReactElement {
  const questProgressPercentage = Math.round(
    (quest.reqCompleted / quest.req) * 100,
  );
  const isCompleted = questProgressPercentage === 100;
  const isClaimed = quest.claimed;

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
    <Card
      className={`p-2 h-fit ${isCompleted ? "border-green-200 bg-green-50 dark:bg-green-900/30" : ""}`}
    >
      <CardContent className="p-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <img
            src={displayIcon(quest.type)}
            alt=""
            className="h-6 w-6 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-xs truncate">{quest.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Badge
                variant="secondary"
                className={`text-[10px] px-1.5 py-0 h-4 ${isClaimed ? "text-green-600" : "text-muted-foreground"}`}
              >
                {isClaimed ? "Claimed" : "In Progress"}
              </Badge>
              {isCompleted && !isClaimed && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 text-amber-600 border-amber-600"
                >
                  Ready to claim
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5">
          <div className="flex-1">
            <Progress value={questProgressPercentage} className="h-1.5" />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium min-w-8 text-right">
            {quest.reqCompleted}/{quest.req}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
