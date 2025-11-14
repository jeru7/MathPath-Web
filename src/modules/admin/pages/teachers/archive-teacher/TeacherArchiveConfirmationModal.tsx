import { type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Teacher } from "@/modules/teacher/types/teacher.type";

type TeacherArchiveConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teacher: Teacher | null;
  sectionsCount: number;
  assessmentsCount: number;
};

export default function TeacherArchiveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  teacher,
  sectionsCount,
  assessmentsCount,
}: TeacherArchiveConfirmationModalProps): ReactElement {
  if (!teacher) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Archive Teacher</DialogTitle>
          <DialogDescription>
            Are you sure you want to archive{" "}
            <strong>
              {teacher.firstName} {teacher.lastName}
            </strong>{" "}
            ({teacher.email})?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {(sectionsCount > 0 || assessmentsCount > 0) && (
            <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <AlertDescription className="text-amber-800 dark:text-amber-300">
                <div className="font-medium mb-2">
                  This teacher has associated data that will be preserved:
                </div>
                <ul className="space-y-1 text-sm">
                  {sectionsCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {sectionsCount} assigned section
                        {sectionsCount !== 1 ? "s" : ""}
                      </strong>
                    </li>
                  )}
                  {assessmentsCount > 0 && (
                    <li>
                      •{" "}
                      <strong>
                        {assessmentsCount} created assessment
                        {assessmentsCount !== 1 ? "s" : ""}
                      </strong>
                    </li>
                  )}
                  <li>• All teaching data and progress</li>
                  <li>• Assessment results and student performance</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {sectionsCount === 0 && assessmentsCount === 0 && (
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> This teacher has no assigned sections or
                created assessments yet. Only their account information will be
                archived.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-4 rounded-lg border">
            <p className="text-sm font-medium mb-2">
              What happens when archiving:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Teacher will no longer appear in active lists</li>
              <li>• All data is preserved and can be restored later</li>
              <li>• Teacher cannot log in while archived</li>
              <li>• Can be restored from the archive section</li>
              <li>• Students in their sections will be reassigned</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Archive Teacher
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
