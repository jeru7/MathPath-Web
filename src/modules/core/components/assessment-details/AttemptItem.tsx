import { type ReactElement } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { IoChevronDown, IoChevronUp, IoEye } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentAttempt } from "../../types/assessment-attempt/assessment-attempt.type";
import { Student } from "@/modules/student/types/student.type";
import { getProfilePicture } from "../../utils/profile-picture.util";

type AttemptItemProps = {
  attempt: AttemptWithStudent;
  passingScore: number;
  formatDuration: (seconds: number) => string;
  formatTimeSpent: (seconds: number) => string;
  formatDate: (dateString: string) => string;
  isExpanded: boolean;
  onToggle: () => void;
  onReview: () => void;
};

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

export default function AttemptItem({
  attempt,
  passingScore,
  formatDuration,
  formatTimeSpent,
  formatDate,
  isExpanded,
  onToggle,
  onReview,
}: AttemptItemProps): ReactElement {
  const isPassed = attempt.score >= passingScore;

  const getStatusVariant = () => {
    switch (attempt.status) {
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      case "paused":
        return "secondary";
      case "abandoned":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (attempt.status) {
      case "completed":
        return "Passed";
      case "failed":
        return "Failed";
      case "paused":
        return "Paused";
      case "abandoned":
        return "Abandoned";
      default:
        return "In Progress";
    }
  };

  const getScoreColor = () => {
    if (isPassed) return "text-green-600 dark:text-green-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="overflow-hidden">
      {/* header */}
      <div
        className="p-4 hover:bg-muted/50 cursor-pointer flex items-center gap-4 transition-colors"
        onClick={onToggle}
      >
        {/* profile pic */}
        <div className="flex-shrink-0">
          {attempt.student.profilePicture ? (
            <img
              src={getProfilePicture(attempt.student.profilePicture)}
              alt={`${attempt.student.firstName} ${attempt.student.lastName}`}
              className="w-10 h-10 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border">
              <span className="text-sm font-semibold text-primary-foreground">
                {attempt.student.firstName[0]}
                {attempt.student.lastName[0]}
              </span>
            </div>
          )}
        </div>

        {/* details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground">
              {attempt.student.firstName} {attempt.student.lastName}
            </h4>
            <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{formatDate(attempt.dateUpdated)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="w-3 h-3" />
              <span>{formatDuration(attempt.timeSpent || 0)}</span>
            </div>
          </div>
        </div>

        {/* expand/collapse button */}
        <div className="flex-shrink-0">
          {isExpanded ? (
            <IoChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <IoChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-4 bg-muted/30 border-t">
              <div className="flex justify-between items-start mb-3">
                <h5 className="font-medium text-sm text-foreground">
                  Attempt Details
                </h5>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview();
                  }}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <IoEye className="w-3 h-3" />
                  Review Answers
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-foreground capitalize">
                      {getStatusText()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Spent:</span>
                    <span className="font-medium text-foreground">
                      {formatTimeSpent(attempt.timeSpent || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Started:</span>
                    <span className="font-medium text-foreground">
                      {attempt.dateStarted
                        ? formatDate(attempt.dateStarted)
                        : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <span className={`font-bold ${getScoreColor()}`}>
                      {attempt.score || 0} points
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Passing Score:
                    </span>
                    <span className="font-medium text-foreground">
                      {passingScore} points
                    </span>
                  </div>
                  {attempt.dateCompleted && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Date Completed:
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDate(attempt.dateCompleted)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {attempt.answers && Object.keys(attempt.answers).length > 0 && (
                <div className="mt-4">
                  <h6 className="font-medium text-sm mb-2 text-foreground">
                    Questions Answered: {Object.keys(attempt.answers).length}
                  </h6>
                  <div className="text-xs text-muted-foreground">
                    Click "Review Answers" to view detailed answers and question
                    breakdown
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
