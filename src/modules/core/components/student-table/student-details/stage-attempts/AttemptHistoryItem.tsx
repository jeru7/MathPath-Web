import { type ReactElement } from "react";
import { format } from "date-fns-tz";
import { StageAttempt } from "../../../../types/stage-attempt/stage-attempt.type";
import { useStages } from "../../../../services/stage/stage.service";

type AttemptHistoryItemProps = {
  attempt: StageAttempt;
};

const calculateCorrectnessPercentage = (attempt: StageAttempt) => {
  const { answerCorrectness } = attempt;

  const totalCorrect =
    answerCorrectness.easy.correctAnswers +
    answerCorrectness.medium.correctAnswers +
    answerCorrectness.hard.correctAnswers;

  const totalAttempts =
    answerCorrectness.easy.attempts +
    answerCorrectness.medium.attempts +
    answerCorrectness.hard.attempts;

  if (totalAttempts === 0) return 0;

  return Math.round((totalCorrect / totalAttempts) * 100);
};

const formatTimeSpent = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const getResult = (attempt: StageAttempt) => {
  if (attempt.completed)
    return {
      label: "Completed",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      dotColor: "bg-green-500",
    };
  if (attempt.fled)
    return {
      label: "Fled",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      dotColor: "bg-yellow-500",
    };
  if (attempt.died)
    return {
      label: "Died",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      dotColor: "bg-red-500",
    };
  return {
    label: "Incomplete",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    dotColor: "bg-gray-500",
  };
};

const getCorrectnessColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600 dark:text-green-400";
  if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export default function AttemptHistoryItem({
  attempt,
}: AttemptHistoryItemProps): ReactElement {
  const { data: stages } = useStages();

  const stage = stages?.find((stage) => stage.id === attempt.stageId);
  const correctnessPercentage = calculateCorrectnessPercentage(attempt);
  const result = getResult(attempt);
  const correctnessColor = getCorrectnessColor(correctnessPercentage);

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
      {/* Stage */}
      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
        {stage?.stage || "N/A"}
      </td>

      {/* Topic */}
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
        {stage?.topic || "N/A"}
      </td>

      {/* Date taken */}
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
        {format(new Date(attempt.date), "MMM dd, yyyy 'at' h:mm a", {
          timeZone: "Asia/Manila",
        })}
      </td>

      {/* Correctness */}
      <td className="px-4 py-3 text-center">
        <span className={`font-semibold ${correctnessColor}`}>
          {correctnessPercentage}%
        </span>
      </td>

      {/* Time Spent */}
      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 font-medium">
        {formatTimeSpent(attempt.secondsPlayed)}
      </td>

      {/* Result */}
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${result.color}`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${result.dotColor}`}
            ></span>
            {result.label}
          </span>
        </div>
      </td>
    </tr>
  );
}
