import { type ReactElement } from "react";
import DetailsOverview from "./DetailsOverview";
import AttemptHistory from "./stage-attempts/AttemptHistory";
import AssessmentAttemptHistory from "./assessment-attempts/AssessmentAttemptHistory";
import { Student } from "../../../../../student/types/student.type";
import { AssessmentAttempt } from "../../../../types/assessment-attempt/assessment-attempt.type";
import { Assessment } from "../../../../types/assessment/assessment.type";
import StatsOverviewCard from "../../../../../student/pages/statistics/components/StatsOverviewCard";
import StudentHeatmap from "../../../../../student/pages/statistics/components/StudentHeatmap";
import StudentTopicStats from "../../../../../student/pages/statistics/components/StudentTopicStats";
import StudentStageStats from "../../../../../student/pages/statistics/components/StudentStageStats";
import StudentQuestionStats from "../../../../../student/pages/statistics/components/StudentQuestionStats";
import { Section } from "../../../../types/section/section.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StudentDetailsModalProps = {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  archiveLabel?: string;
};

export type AttemptWithAssessment = AssessmentAttempt & {
  assessmentTitle: string | null;
  assessmentPassingScore: number;
  assessmentData: Assessment | null;
};

export default function StudentDetailsModal({
  student,
  isOpen,
  onClose,
  sections,
  onEdit,
  onArchive,
  onDelete,
  disableEdit,
  disableDelete,
  archiveLabel = "Archive",
}: StudentDetailsModalProps): ReactElement {
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-2xl font-bold">Student Card</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <DetailsOverview student={student} sections={sections} />
            </Card>
            <div>
              <StatsOverviewCard student={student} />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <StudentHeatmap studentId={student.id} />
            </div>
            <div>
              <StudentTopicStats studentId={student.id} />
            </div>
            <div>
              <StudentStageStats studentId={student.id} />
            </div>
            <div>
              <StudentQuestionStats studentId={student.id} />
            </div>
          </div>

          <div>
            <AttemptHistory student={student} />
          </div>

          <div className="pb-4">
            <AssessmentAttemptHistory student={student} />
          </div>
        </div>

        <div className="border-t pt-4 mt-4 flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Badge variant="outline" className="text-xs">
              Last updated: {new Date(student.updatedAt).toLocaleDateString()}
            </Badge>
          </div>
          <div className="flex gap-2 justify-center sm:justify-end">
            {!disableEdit && onEdit && (
              <Button
                variant="outline"
                onClick={handleEdit}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                Edit
              </Button>
            )}
            {onArchive && (
              <Button
                variant="outline"
                onClick={handleArchive}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                {archiveLabel}
              </Button>
            )}
            {onDelete && !disableDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
