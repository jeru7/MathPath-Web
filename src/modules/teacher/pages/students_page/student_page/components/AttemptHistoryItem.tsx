import { type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns-tz";
import { StageAttempt } from "../../../../../core/types/stage_attempt/stage_attempt.types";
import { getStages } from "../../../../../core/services/stage/stage.service";
import { Stage } from "../../../../../core/types/stage/stage.types";

interface IAttemptHistoryItemProps {
  attempt: StageAttempt;
}

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

const getResult = (attempt: StageAttempt) => {
  if (attempt.completed)
    return { label: "Completed", color: "bg-green-100 text-green-800" };
  if (attempt.fled)
    return { label: "Fled", color: "bg-yellow-100 text-yellow-800" };
  if (attempt.died) return { label: "Died", color: "bg-red-100 text-red-800" };
  return { label: "Incomplete", color: "bg-gray-100 text-gray-800" };
};

export default function AttemptHistoryItem({
  attempt,
}: IAttemptHistoryItemProps): ReactElement {
  const { data: stages } = useQuery<Stage[]>({
    queryKey: ["stages"],
    queryFn: () => getStages(),
  });

  const stage = stages?.find((stage) => stage.id === attempt.stageId);

  return (
    <tr className="text-center font-primary hover:bg-[var(--primary-gray)]/30 transition duration-200">
      {/* Stage */}
      <td className="font-bold">{stage?.stage || "N/A"}</td>
      {/* Topic */}
      <td className="italic">{stage?.topic || "N/A"}</td>
      {/* Date taken */}
      <td className="text-[var(--primary-gray)]">
        {format(new Date(attempt.date), "MMMM dd, yyyy 'at' h:mm a", {
          timeZone: "Asia/Manila",
        })}
      </td>
      {/* Correctness */}
      <td className="">{calculateCorrectnessPercentage(attempt)}%</td>
      {/* Result */}
      <td>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getResult(attempt).color}`}
        >
          {getResult(attempt).label}
        </span>
      </td>
    </tr>
  );
}
