import { type ReactElement, useState } from "react";
import TeacherArchiveList from "./TeacherArchiveList";
import TeacherDetailsModal from "../TeacherDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Teacher } from "@/modules/teacher/types/teacher.type";

type TeacherArchiveModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  onRestoreTeacher: (teacherId: string) => void;
  onDeleteTeacher: (teacherId: string) => void;
};

export default function TeacherArchiveModal({
  isOpen,
  onClose,
  teachers,
  onRestoreTeacher,
  onDeleteTeacher,
}: TeacherArchiveModalProps): ReactElement {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleCloseDetailsModal = () => {
    setSelectedTeacher(null);
  };

  const handleRestore = () => {
    if (selectedTeacher) {
      onRestoreTeacher(selectedTeacher.id);
      setSelectedTeacher(null);
    }
  };

  const handleDelete = () => {
    if (selectedTeacher) {
      onDeleteTeacher(selectedTeacher.id);
      setSelectedTeacher(null);
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
                  Archived Teachers
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {teachers.length} archived teacher
                    {teachers.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 p-6">
            <TeacherArchiveList
              teachers={teachers}
              onTeacherClick={handleTeacherClick}
            />
          </ScrollArea>

          <CardFooter className="border-t p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Select a teacher to view details or restore
            </p>
          </CardFooter>
        </DialogContent>
      </Dialog>

      {selectedTeacher && (
        <TeacherDetailsModal
          teacher={selectedTeacher}
          isOpen={!!selectedTeacher}
          onClose={handleCloseDetailsModal}
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
