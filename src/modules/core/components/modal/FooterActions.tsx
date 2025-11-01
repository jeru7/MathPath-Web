import { format } from "date-fns-tz";
import { type ReactElement } from "react";
import { FaEdit, FaArchive, FaTrash } from "react-icons/fa";

export type FooterActionsProps = {
  lastUpdated: string;
  disableEdit?: boolean;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  archiveLabel?: string;
  deleteLabel?: string;
  className?: string;
};

export default function FooterActions({
  lastUpdated,
  disableEdit = false,
  onEdit,
  onArchive,
  onDelete,
  editLabel = "Edit",
  archiveLabel = "Archive",
  deleteLabel = "Delete",
  className = "",
}: FooterActionsProps): ReactElement {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 gap-3 ${className}`}
    >
      {/* last updated */}
      <div className="flex items-center justify-center sm:justify-start text-xs text-gray-500 dark:text-gray-400 w-full sm:w-auto order-2 sm:order-1">
        <span className="text-gray-400 dark:text-gray-500 mr-1">
          Last updated:
        </span>
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {format(new Date(lastUpdated), "MMM d, yyyy 'at' h:mm a")}
        </span>
      </div>

      {/* action buttons */}
      <div className="flex items-stretch w-full sm:w-auto gap-2 order-1 sm:order-2">
        {onEdit && !disableEdit && (
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 transition-all duration-200 hover:shadow-sm flex-1 sm:flex-none min-w-[80px]"
          >
            <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:block">{editLabel}</span>
            <span className="xs:hidden">{editLabel}</span>
          </button>
        )}

        {onArchive && (
          <button
            onClick={onArchive}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded border border-gray-300 dark:border-gray-600 transition-all duration-200 hover:shadow-sm flex-1 sm:flex-none min-w-[80px]"
          >
            <FaArchive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:block">{archiveLabel}</span>
            <span className="xs:hidden">{archiveLabel}</span>
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded border border-red-600 transition-all duration-200 hover:shadow-sm flex-1 sm:flex-none min-w-[80px]"
          >
            <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:block">{deleteLabel}</span>
            <span className="xs:hidden">{deleteLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
