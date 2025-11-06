import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import AssessmentTimer from "./AssessmentTimer";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";

type AssessmentHeaderProps = {
  assessment: Assessment;
  onClose: () => void;
  timeRemaining?: number;
  totalTime?: number;
  isTimerRunning?: boolean;
  onPauseTimer?: () => void;
  onResumeTimer?: () => void;
};

export default function AssessmentHeader({
  assessment,
  onClose,
  timeRemaining,
  totalTime,
  isTimerRunning = true,
}: AssessmentHeaderProps): ReactElement {
  return (
    <div className="bg-background border-b shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex items-center space-x-2 p-2 flex-shrink-0"
            >
              <IoClose className="w-5 h-5" />
              <span className="font-medium text-sm hidden sm:block">Exit</span>
            </Button>

            <Separator
              orientation="vertical"
              className="h-6 hidden sm:block flex-shrink-0"
            />

            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold truncate">
                {assessment.title || "Untitled Assessment"}
              </h1>
              {assessment.topic && (
                <p className="text-sm text-muted-foreground truncate hidden sm:block">
                  {assessment.topic}
                </p>
              )}
            </div>
          </div>

          {/* Right side */}
          {assessment.timeLimit > 0 &&
            timeRemaining !== undefined &&
            totalTime !== undefined && (
              <div className="flex-shrink-0 ml-4">
                <AssessmentTimer
                  timeRemaining={timeRemaining}
                  totalTime={totalTime}
                  isTimerRunning={isTimerRunning}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
