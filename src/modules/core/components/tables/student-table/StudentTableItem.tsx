import { useEffect, useState, type ReactElement } from "react";
import { format } from "date-fns-tz";
import {
  Student,
  StudentStatusType,
} from "../../../../student/types/student.type";
import { capitalizeWord } from "../../../../core/utils/string.util";
import { getSectionName } from "../../../../teacher/pages/students/utils/student-table.util";
import { Section } from "../../../types/section/section.type";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/modules/core/utils/date.util";

type StudentTableItemProps = {
  student: Student;
  onClick: (studentId: string) => void;
  sections: Section[];
  onlineStudentIds: Set<string>;
};

export default function StudentTableItem({
  student,
  onClick,
  sections,
  onlineStudentIds,
}: StudentTableItemProps): ReactElement {
  const [status, setStatus] = useState<StudentStatusType>("Offline");

  const handleRowClick = () => {
    onClick(student.id);
  };

  useEffect(() => {
    setStatus(onlineStudentIds.has(student.id) ? "Online" : "Offline");
  }, [onlineStudentIds, student.id]);

  return (
    <TableRow
      className={cn("cursor-pointer transition-colors hover:bg-muted/50 h-18")}
      onClick={handleRowClick}
    >
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="font-medium text-sm">{student.referenceNumber}</p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="text-sm line-clamp-2">
            {`${student.lastName}, ${capitalizeWord(`${student.firstName}`)}`}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">
            {getSectionName(student.sectionId, sections)}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <Badge
            variant={status === "Online" ? "default" : "secondary"}
            className={cn(
              status === "Online"
                ? "bg-green-500 text-background  hover:bg-green-600"
                : "bg-red-500 text-background hover:bg-red-600",
            )}
          >
            {status}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground text-center">
            {student.createdAt
              ? formatDate(student.createdAt.toString())
              : "N/A"}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {student.lastOnline
              ? format(
                new Date(student.lastOnline),
                "MMMM d, yyyy 'at' hh:mm a",
                {
                  timeZone: "Asia/Manila",
                },
              )
              : "N/A"}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}
