import { type ReactElement } from "react";
import {
  Request,
  RequestType,
} from "../../../../../core/types/requests/request.type";
import { useTeacherContext } from "../../../../context/teacher.context";

interface RequestTableItemProps {
  request: Request;
  getStatusColor: (status: string) => string;
  getTypeLabel: (type: RequestType) => string;
  formatDate: (dateString?: string) => string;
  onRequestClick: (request: Request) => void;
}

export default function RequestTableItem({
  request,
  getStatusColor,
  getTypeLabel,
  formatDate,
  onRequestClick,
}: RequestTableItemProps): ReactElement {
  const { students } = useTeacherContext();

  const student = students.find((s) => s.id === request.senderId);

  const handleClick = () => {
    onRequestClick(request);
  };

  return (
    <tr
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
      onClick={handleClick}
    >
      {/* name */}
      <td className="py-4 w-[20%]">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {student?.firstName} {student?.lastName}
          </span>
        </div>
      </td>

      {/* request type */}
      <td className="py-4 w-[20%]">
        <span className="text-gray-900 dark:text-gray-100">
          {getTypeLabel(request.type)}
        </span>
      </td>

      {/* email */}
      <td className="py-4 w-[20%]">
        <span className="text-gray-900 dark:text-gray-100">
          {student?.email || "N/A"}
        </span>
      </td>

      {/* status */}
      <td className="py-4 w-[20%]">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            request.status,
          )}`}
        >
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      </td>

      {/* date */}
      <td className="py-4 text-gray-900 dark:text-gray-100 w-[20%]">
        {formatDate(request.createdAt)}
      </td>
    </tr>
  );
}
