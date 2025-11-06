import { type ReactElement } from "react";
import { Card, CardContent } from "../../../../../../components/ui/card";
import { Progress } from "../../../../../../components/ui/progress";

type AssessmentTimerProps = {
  timeRemaining: number;
  totalTime: number;
  isTimerRunning?: boolean;
};

export default function AssessmentTimer({
  timeRemaining,
  totalTime,
  isTimerRunning = true,
}: AssessmentTimerProps): ReactElement {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const percentage = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

  const getTextColor = () => {
    if (percentage > 60) return "text-green-700 dark:text-green-400";
    if (percentage > 30) return "text-yellow-700 dark:text-yellow-400";
    if (percentage > 15) return "text-orange-700 dark:text-orange-400";
    return "text-red-700 dark:text-red-400";
  };

  const getPulseAnimation = () => {
    if (percentage <= 15 && isTimerRunning) return "animate-pulse";
    return "";
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="px-3 py-2">
      <CardContent className="p-0 flex items-center space-x-3">
        <div className="text-center">
          <div
            className={`text-sm font-bold ${getTextColor()} ${getPulseAnimation()}`}
          >
            {formatTime(minutes, seconds)}
            {!isTimerRunning && (
              <span className="text-xs ml-1 text-muted-foreground">
                (Paused)
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide hidden sm:block">
            Time Remaining
          </div>
        </div>

        <Progress value={percentage} className="w-16 sm:w-20 h-2 bg-muted" />
      </CardContent>
    </Card>
  );
}
