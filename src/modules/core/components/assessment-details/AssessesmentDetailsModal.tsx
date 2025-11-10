import { type ReactElement, useMemo, useState } from "react";
import { format } from "date-fns-tz";
import { Assessment } from "../../../core/types/assessment/assessment.type";
import { Student } from "../../../student/types/student.type";
import { Teacher } from "../../../teacher/types/teacher.type";
import { AssessmentAttempt } from "../../../core/types/assessment-attempt/assessment-attempt.type";
import { TIMEZONE } from "../../../core/constants/date.constant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AttemptReviewModal from "../assessment-attempt-review/AttemptReviewModal";
import AssessmentInformation from "./AssessmentInformation";
import AttemptList from "./AttemptList";
import { useAdminContext } from "@/modules/admin/context/admin.context";
import { useTeacherContext } from "@/modules/teacher/context/teacher.context";

type AttemptWithStudent = AssessmentAttempt & {
  student: Student;
};

type AssessmentDetailsModalProps = {
  assessment: Assessment;
  isOpen: boolean;
  onClose: () => void;
  studentAttempts?: AssessmentAttempt[];
  students?: Student[];
  teacher?: Teacher;

  userType: "admin" | "teacher";
  userId: string;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  archiveLabel?: string;
  showFooter?: boolean;
};

export default function AssessmentDetailsModal({
  assessment,
  isOpen,
  onClose,
  studentAttempts,
  students,
  teacher,
  userType,
  userId,
  onEdit,
  onArchive,
  onDelete,
  showFooter = true,
  archiveLabel = "Archive",
  disableEdit = false,
  disableDelete = false,
}: AssessmentDetailsModalProps): ReactElement {
  const context = userType === "teacher" ? useTeacherContext : useAdminContext;
  const { rawStudents } = context();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const safeStudentAttempts = useMemo(() => {
    if (!studentAttempts) return [];
    if (Array.isArray(studentAttempts)) return studentAttempts;
    return [];
  }, [studentAttempts]);

  const totalQuestions = useMemo(() => {
    return (
      assessment?.pages?.reduce((total, page) => {
        const questionCount = page.contents.filter(
          (content) => content.type === "question",
        ).length;
        return total + questionCount;
      }, 0) || 0
    );
  }, [assessment]);

  const averageScore = useMemo(() => {
    if (safeStudentAttempts.length === 0) return 0;
    const totalScore = safeStudentAttempts.reduce((sum, attempt) => {
      const score = attempt.score || 0;
      return sum + score;
    }, 0);
    return Math.round(totalScore / safeStudentAttempts.length);
  }, [safeStudentAttempts]);

  // calculate student count for this assessment
  const studentCount = useMemo(() => {
    if (!students || !assessment.sections) return 0;
    return students.filter((student) =>
      assessment.sections.includes(student.sectionId),
    ).length;
  }, [students, assessment.sections]);

  const handleReviewAttempt = (attempt: AttemptWithStudent) => {
    setSelectedAttempt(attempt);
    setSelectedStudent(attempt.student);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAttempt(null);
    setSelectedStudent(null);
  };

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

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a", {
        timeZone: TIMEZONE,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (!assessment) return <div>Loading...</div>;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[100dvw] h-[100dvh] max-w-none flex flex-col p-0 sm:max-w-[90vw] sm:h-[85vh] lg:max-w-[75vw] lg:max-h-[800px]">
          <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold line-clamp-1">
                  {assessment.title || "Untitled Assessment"}
                </DialogTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                  {assessment.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {assessment.description}
                    </p>
                  )}
                  {teacher && userType === "admin" && (
                    <p className="text-sm text-muted-foreground">
                      Created by: {teacher.firstName} {teacher.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* main content: scrollable part */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <div className="p-4">
                  <AssessmentInformation
                    assessment={assessment}
                    totalQuestions={totalQuestions}
                    averageScore={averageScore}
                    studentCount={studentCount}
                    teacher={userType === "admin" ? teacher : undefined}
                  />
                </div>

                <div className="p-4">
                  <AttemptList
                    userType={userType}
                    userId={userId}
                    onReview={handleReviewAttempt}
                    assessment={assessment}
                    students={rawStudents}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* footer actions */}
          {showFooter && (
            <div className="border-t p-6 flex-shrink-0 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs">
                  Last updated: {formatDate(assessment.updatedAt)}
                </Badge>
              </div>
              <div className="flex gap-2 justify-center sm:justify-end">
                {onEdit && !disableEdit && (
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
          )}
        </DialogContent>
      </Dialog>

      {/* review modal */}
      <AttemptReviewModal
        isOpen={reviewModalOpen}
        assessment={assessment}
        attempt={selectedAttempt}
        student={selectedStudent}
        onClose={handleCloseReviewModal}
      />
    </>
  );
}
