import { type ReactElement, useState } from "react";
import AssessmentArchiveList from "./AssessmentArchiveList";
import { Assessment } from "../../types/assessment/assessment.type";
import { Student } from "../../../student/types/student.type";
import { AssessmentAttempt } from "../../types/assessment-attempt/assessment-attempt.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AssessmentDetailsModal from "../assessment-details/AssessesmentDetailsModal";

type AssessmentArchiveModalProps = {
  userType: "teacher" | "admin";
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  assessments: Assessment[];
  onRestoreAssessment: (assessmentId: string) => void;
  onDeleteAssessment: (assessmentId: string) => void;
  students?: Student[];
  studentAttempts?: AssessmentAttempt[];
};

export default function AssessmentArchiveModal({
  userType,
  isOpen,
  userId,
  onClose,
  assessments,
  onRestoreAssessment,
  onDeleteAssessment,
  students = [],
  studentAttempts = [],
}: AssessmentArchiveModalProps): ReactElement {
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const handleAssessmentClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleCloseDetailsModal = () => {
    setSelectedAssessment(null);
  };

  const handleRestore = () => {
    if (selectedAssessment) {
      onRestoreAssessment(selectedAssessment.id);
      setSelectedAssessment(null);
    }
  };

  const handleDelete = () => {
    if (selectedAssessment) {
      onDeleteAssessment(selectedAssessment.id);
      setSelectedAssessment(null);
    }
  };

  // filter student attempts for the selected assessment
  const getStudentAttemptsForAssessment = (assessmentId: string) => {
    return studentAttempts.filter(
      (attempt) => attempt.assessmentId === assessmentId,
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[85vh] max-h-[800px] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold">
                  Archived Assessments
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {assessments.length} archived assessment
                    {assessments.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AssessmentArchiveList
              assessments={assessments}
              onAssessmentClick={handleAssessmentClick}
            />
          </div>

          {/* footer */}
          <div className="border-t p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Select an assessment to view details or restore
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* assessment details modal for archived assessments */}
      {selectedAssessment && (
        <AssessmentDetailsModal
          userType={userType}
          userId={userId}
          assessment={selectedAssessment}
          isOpen={!!selectedAssessment}
          onClose={handleCloseDetailsModal}
          studentAttempts={getStudentAttemptsForAssessment(
            selectedAssessment.id,
          )}
          students={students}
          onArchive={handleRestore}
          onDelete={handleDelete}
          disableEdit={true}
          disableDelete={true}
          archiveLabel="Restore"
        />
      )}
    </>
  );
}
