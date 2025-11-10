import { TopStudent } from "@/modules/student/types/top-student.type";
import { type ReactElement } from "react";
import { FaCrown, FaTrophy } from "react-icons/fa";

type TopStudentItemProps = {
  student: TopStudent;
  rank: number;
  onItemClick?: (student: TopStudent) => void;
};

export default function TopStudentItem({
  student,
  rank,
  onItemClick,
}: TopStudentItemProps): ReactElement {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-primary/5",
          border: "border-primary/20",
          text: "text-primary",
        };
      case 2:
        return {
          bg: "bg-amber-500/5",
          border: "border-amber-500/20",
          text: "text-amber-600",
        };
      case 3:
        return {
          bg: "bg-chart-3/5",
          border: "border-chart-3/20",
          text: "text-chart-3",
        };
      default:
        return {
          bg: "bg-muted/30",
          border: "border-border",
          text: "text-muted-foreground",
        };
    }
  };

  const getWinrateColor = (correctness: number) => {
    if (correctness >= 80) return "text-chart-2";
    if (correctness >= 60) return "text-amber-500";
    return "text-destructive";
  };

  const rankStyle = getRankStyle(rank);

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-md border ${rankStyle.border} ${rankStyle.bg} opacity-90 hover:opacity-100 cursor-pointer transition-all`}
      onClick={() => onItemClick?.(student)}
    >
      {/* rank */}
      <div
        className={`flex items-center justify-center w-5 h-5 rounded text-xs font-semibold ${rankStyle.text}`}
      >
        {rank === 1 ? (
          <FaTrophy className="w-2.5 h-2.5" />
        ) : rank <= 3 ? (
          <FaCrown className="w-2.5 h-2.5" />
        ) : (
          rank
        )}
      </div>

      {/* student info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-foreground truncate">
            {student.firstName} {student.lastName}
          </span>
          <span className="text-xs text-muted-foreground px-1 bg-muted rounded">
            Lvl {student.level}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{student.sectionName}</span>
          <span>•</span>
          <span>Stage {student.highestStage}</span>
        </div>
      </div>

      {/* correctness */}
      <div className="text-right">
        <div
          className={`text-sm font-medium ${getWinrateColor(student.winRate)}`}
        >
          {student.winRate}%
        </div>
      </div>
    </div>
  );
}
