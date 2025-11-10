import { type ReactElement } from "react";
import { Teacher } from "../../../teacher/types/teacher.type";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TeacherTableItemProps = {
  teacher: Teacher;
  onClick: (teacherId: string) => void;
};

export default function TeacherTableItem({
  teacher,
  onClick,
}: TeacherTableItemProps): ReactElement {
  const handleRowClick = () => {
    onClick(teacher.id);
  };

  const getFullName = () => {
    return `${teacher.lastName}, ${teacher.firstName}${teacher.middleName ? ` ${teacher.middleName.charAt(0)}.` : ""}`.trim();
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      default:
        return gender;
    }
  };

  return (
    <TableRow
      className={cn("cursor-pointer transition-colors hover:bg-muted/50 h-18")}
      onClick={handleRowClick}
    >
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="font-medium text-sm">{teacher.email}</p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="text-sm line-clamp-2">{getFullName()}</p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground capitalize">
            {getGenderDisplay(teacher.gender)}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-4 align-middle">
        <div className="flex items-center">
          <Badge
            variant={teacher.verified.verified ? "default" : "secondary"}
            className={cn(
              teacher.verified.verified
                ? "bg-green-500 text-background hover:bg-green-600"
                : "bg-yellow-500 text-background hover:bg-yellow-600",
            )}
          >
            {teacher.verified.verified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  );
}
