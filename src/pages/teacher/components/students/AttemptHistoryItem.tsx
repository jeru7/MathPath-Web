import { type ReactElement } from "react"
import { IStudentAttempt } from "../../../../types/student.type"
import { useQuery } from "@tanstack/react-query";
import { getGameLevels } from "../../../../services/gamelevel-service";
import { IGameLevel } from "../../../../types/gamelevel.type";
import { format } from "date-fns";
import { convertToPhilippinesDate } from "../../../../utils/date.util";

interface IAttemptHistoryItemProps {
  attempt: IStudentAttempt;
}

const calculateCorrectnessPercentage = (attempt: IStudentAttempt) => {
  const { answerCorrectness } = attempt;

  const totalCorrect = answerCorrectness.easy.correctAnswers +
    answerCorrectness.medium.correctAnswers +
    answerCorrectness.hard.correctAnswers;

  const totalAttempts = answerCorrectness.easy.attempts +
    answerCorrectness.medium.attempts +
    answerCorrectness.hard.attempts;

  if (totalAttempts === 0) return 0;

  return Math.round((totalCorrect / totalAttempts) * 100);
};

const getResult = (attempt: IStudentAttempt) => {
  if (attempt.completed) return { label: "Completed", color: "bg-green-100 text-green-800" };
  if (attempt.fled) return { label: "Fled", color: "bg-yellow-100 text-yellow-800" };
  if (attempt.died) return { label: "Died", color: "bg-red-100 text-red-800" };
  return { label: "Incomplete", color: "bg-gray-100 text-gray-800" };
};

export default function AttemptHistoryItem({ attempt }: IAttemptHistoryItemProps): ReactElement {

  const { data: gameLevels } = useQuery<IGameLevel[]>({
    queryKey: ['gameLevels'],
    queryFn: () => getGameLevels(),
  });

  const gameLevel = gameLevels?.find((level) => level._id === attempt.gameLevelId);

  return (
    <tr className="text-center font-primary hover:bg-[var(--primary-gray)]/30 transition duration-200">
      {/* Game level */}
      <td className="font-bold">{gameLevel?.level || "Unknown Level"}</td>
      {/* Topic */}
      <td className="italic">{gameLevel?.topic || "Unknown Level"}</td>
      {/* Date taken */}
      <td className="text-[var(--primary-gray)]">{format(convertToPhilippinesDate(attempt.dateTaken.toString()), "MMMM dd, yyyy 'at' h:mm a")}</td>
      {/* Correctness */}
      <td className="">{calculateCorrectnessPercentage(attempt)}%</td>
      {/* Result */}
      <td>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getResult(attempt).color}`}>
          {getResult(attempt).label}
        </span>
      </td>
    </tr>
  )
}
