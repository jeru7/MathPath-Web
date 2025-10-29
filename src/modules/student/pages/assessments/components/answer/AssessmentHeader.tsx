import { type ReactElement } from "react";
import { IoClose } from "react-icons/io5";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";
import AssessmentTimer from "./AssessmentTimer";

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
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* left side */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex-shrink-0"
            >
              <IoClose className="w-5 h-5" />
              <span className="font-medium text-sm hidden sm:block">Exit</span>
            </button>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block flex-shrink-0"></div>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                {assessment.title || "Untitled Assessment"}
              </h1>
              {assessment.topic && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate hidden sm:block">
                  {assessment.topic}
                </p>
              )}
            </div>
          </div>

          {/* right side */}
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
