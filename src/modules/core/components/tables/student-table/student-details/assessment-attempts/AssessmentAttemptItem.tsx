import { useState, type ReactElement } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  XCircle,
  Eye,
  Pause,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AttemptWithAssessment } from "../StudentDetailsModal";
import { Student } from "../../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../../types/assessment-attempt/assessment-attempt.type";
import { Assessment } from "../../../../../types/assessment/assessment.type";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AttemptReviewModal from "@/modules/core/components/assessment-attempt-review/AttemptReviewModal";

type AssessmentAttemptItemProps = {
  attempt: AttemptWithAssessment;
  student: Student;
};

export default function AssessmentAttemptItem({
  attempt,
  student,
}: AssessmentAttemptItemProps): ReactElement {
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const toggleAttempt = (attemptId: string) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  const handleReviewAttempt = (attempt: AttemptWithAssessment) => {
    setSelectedAttempt(attempt);
    setSelectedAssessment(attempt.assessmentData);
    setReviewModalOpen(true);
  };

  const getStatusIcon = (status: AssessmentAttempt["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "abandoned":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: AssessmentAttempt["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "paused":
        return "secondary";
      case "abandoned":
        return "destructive";
      case "failed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: AssessmentAttempt["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "paused":
        return "Paused";
      case "abandoned":
        return "Abandoned";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const getScoreColor = (percentage: number, passingScore: number) => {
    if (percentage >= passingScore) return "text-green-600";
    if (percentage >= passingScore * 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTimeSpent = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAttempt(null);
    setSelectedAssessment(null);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="p-3 sm:p-4 hover:bg-muted/50 cursor-pointer"
        onClick={() => toggleAttempt(attempt.id || "")}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(attempt.status)}
                <h4 className="font-medium text-sm sm:text-base line-clamp-1">
                  {attempt.assessmentTitle}
                </h4>
              </div>
              <Badge
                variant={getStatusVariant(attempt.status)}
                className="w-fit"
              >
                {getStatusText(attempt.status)}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span>Time: {formatTimeSpent(attempt.timeSpent)}</span>
              <span>
                {attempt.dateCompleted
                  ? format(new Date(attempt.dateCompleted), "MMM d, yyyy")
                  : format(new Date(attempt.dateUpdated), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            <div className="text-right">
              <div
                className={cn(
                  "text-sm sm:text-lg font-bold",
                  getScoreColor(attempt.score, attempt.assessmentPassingScore),
                )}
              >
                {attempt.score} pts
              </div>
              <div className="text-xs text-muted-foreground">
                Pass: {attempt.assessmentPassingScore}
              </div>
            </div>
            {expandedAttempt === attempt.id ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {expandedAttempt === attempt.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-3 sm:p-4 bg-muted/30 border-t">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-3">
                <h5 className="font-medium text-sm">Attempt Details</h5>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReviewAttempt(attempt);
                  }}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Eye className="w-3 h-3" />
                  Review Answers
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Status:
                    </span>
                    <span className="font-medium text-xs sm:text-sm capitalize">
                      {attempt.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Time Spent:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {formatTimeSpent(attempt.timeSpent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Date Started:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {format(new Date(attempt.dateStarted), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      Raw Score:
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {attempt.score} points
                    </span>
                  </div>
                  {attempt.dateCompleted && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        Date Completed:
                      </span>
                      <span className="font-medium text-xs sm:text-sm">
                        {format(new Date(attempt.dateCompleted), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {attempt.answers && Object.keys(attempt.answers).length > 0 && (
                <div className="mt-3">
                  <h6 className="font-medium text-sm mb-1">
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

      <AttemptReviewModal
        isOpen={reviewModalOpen}
        assessment={selectedAssessment}
        attempt={selectedAttempt}
        student={student}
        onClose={handleCloseReviewModal}
      />
    </Card>
  );
}
