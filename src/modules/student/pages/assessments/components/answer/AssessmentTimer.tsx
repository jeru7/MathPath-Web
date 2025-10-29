import { type ReactElement } from "react";

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

  const getTimerColor = () => {
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-yellow-500";
    if (percentage > 15) return "bg-orange-500";
    return "bg-red-500";
  };

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
    <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-600">
      <div className="text-center">
        <div
          className={`text-sm font-bold ${getTextColor()} ${getPulseAnimation()}`}
        >
          {formatTime(minutes, seconds)}
          {!isTimerRunning && (
            <span className="text-xs ml-1 text-gray-500">(Paused)</span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide hidden sm:block">
          Time Remaining
        </div>
      </div>

      <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${getTimerColor()}`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
}
