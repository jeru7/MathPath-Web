import { type ReactElement } from "react";
import { format } from "date-fns-tz";
import { StageAttempt } from "../../../../../types/stage-attempt/stage-attempt.type";
import { useStages } from "../../../../../services/stage/stage.service";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const getResultVariant = (attempt: StageAttempt) => {
  if (attempt.completed) return "default";
  if (attempt.fled) return "secondary";
  if (attempt.died) return "destructive";
  return "outline";
};

const getResultLabel = (attempt: StageAttempt) => {
  if (attempt.completed) return "Completed";
  if (attempt.fled) return "Fled";
  if (attempt.died) return "Died";
  return "Incomplete";
};

const getCorrectnessColor = (percentage: number): string => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-red-600";
};

export default function AttemptHistoryItem({
  attempt,
}: AttemptHistoryItemProps): ReactElement {
  const { data: stages } = useStages();
  const stage = stages?.find((stage) => stage.id === attempt.stageId);
  const correctnessPercentage = calculateCorrectnessPercentage(attempt);
  const correctnessColor = getCorrectnessColor(correctnessPercentage);

  return (
    <TableRow className="hover:bg-muted/50 transition-colors duration-150">
      <TableCell className="text-center font-medium text-xs sm:text-sm">
        {stage?.stage || "N/A"}
      </TableCell>
      <TableCell className="truncate max-w-[5rem] sm:max-w-[10rem] text-xs sm:text-sm">
        {stage?.topic || "N/A"}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs sm:text-sm">
        {format(new Date(attempt.date), "MMM dd, yyyy", {
          timeZone: "Asia/Manila",
        })}
      </TableCell>
      <TableCell className="text-center">
        <span
          className={cn("font-semibold text-xs sm:text-sm", correctnessColor)}
        >
          {correctnessPercentage}%
        </span>
      </TableCell>
      <TableCell className="text-center text-muted-foreground font-medium text-xs sm:text-sm">
        {formatTimeSpent(attempt.secondsPlayed)}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={getResultVariant(attempt)}
          className={cn(
            "text-xs",
            attempt.fled &&
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
          )}
        >
          {getResultLabel(attempt)}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
