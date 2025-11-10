import { type ReactElement } from "react";
import {
  Request,
  RequestType,
} from "../../../../../core/types/requests/request.type";
import { useTeacherContext } from "../../../../context/teacher.context";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RequestTableItemProps {
  request: Request;
  getStatusColor: (status: string) => string;
  getTypeLabel: (type: RequestType) => string;
  formatDate: (dateString?: string) => string;
  onRequestClick: (request: Request) => void;
}

export default function RequestTableItem({
  request,
  getTypeLabel,
  formatDate,
  onRequestClick,
}: RequestTableItemProps): ReactElement {
  const { allStudents } = useTeacherContext();

  const student = allStudents.find((s) => s.id === request.senderId);
  const isArchived = student?.archive?.isArchive;

  const handleClick = () => {
    if (!isArchived) {
      onRequestClick(request);
    }
  };

  const statusVariant = () => {
    switch (request.status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <TableRow
      className={`transition-colors group h-18 ${isArchived
        ? "opacity-50 bg-muted/30 cursor-not-allowed"
        : "hover:bg-muted/50 cursor-pointer"
        }`}
      onClick={handleClick}
    >
      {/* Name */}
      <TableCell className="w-[20%] py-4">
        <div className="flex flex-col">
          <span
            className={`font-medium ${isArchived ? "text-muted-foreground" : "text-foreground"
              }`}
          >
            {student?.firstName} {student?.lastName}
          </span>
        </div>
      </TableCell>

      {/* Request Type */}
      <TableCell className="w-[20%] py-4">
        <span
          className={isArchived ? "text-muted-foreground" : "text-foreground"}
        >
          {getTypeLabel(request.type)}
        </span>
      </TableCell>

      {/* Email */}
      <TableCell className="w-[20%] py-4">
        <span
          className={isArchived ? "text-muted-foreground" : "text-foreground"}
        >
          {student?.email || "N/A"}
        </span>
      </TableCell>

      {/* Status */}
      <TableCell className="w-[20%] py-4">
        <div className="w-full flex items-center justify-center">
          <Badge
            variant={statusVariant()}
            className={`text-xs ${isArchived ? "opacity-70" : ""}`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </TableCell>

      {/* Date */}
      <TableCell className="w-[20%] py-4">
        <div
          className={`text-center ${isArchived ? "text-muted-foreground" : "text-foreground"
            }`}
        >
          {formatDate(request.createdAt)}
        </div>
      </TableCell>
    </TableRow>
  );
}
