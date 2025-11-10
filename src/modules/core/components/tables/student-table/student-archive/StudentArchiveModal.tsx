import { type ReactElement, useState } from "react";
import { Student } from "../../../../../student/types/student.type";
import { Section } from "../../../../types/section/section.type";
import StudentArchiveList from "./StudentArchiveList";
import StudentDetailsModal from "../student-details/StudentDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type StudentArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onRestoreStudent: (studentId: string) => void;
  onDeleteStudent: (studentId: string) => void;
  sections: Section[];
};

export default function StudentArchiveModal({
  isOpen,
  onClose,
  students,
  onRestoreStudent,
  onDeleteStudent,
  sections,
}: StudentArchiveModalProps): ReactElement {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseDetailsModal = () => {
    setSelectedStudent(null);
  };

  const handleRestore = () => {
    if (selectedStudent) {
      onRestoreStudent(selectedStudent.id);
      setSelectedStudent(null);
    }
  };

  const handleDelete = () => {
    if (selectedStudent) {
      onDeleteStudent(selectedStudent.id);
      setSelectedStudent(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Archived Students
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {students.length} archived student
                    {students.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <StudentArchiveList
              students={students}
              onStudentClick={handleStudentClick}
            />
          </ScrollArea>

          <CardFooter className="border-t p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Select a student to view details or restore
            </p>
          </CardFooter>
        </DialogContent>
      </Dialog>

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={!!selectedStudent}
          onClose={handleCloseDetailsModal}
          sections={sections}
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
