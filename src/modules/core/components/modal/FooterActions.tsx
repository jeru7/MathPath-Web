import { format } from "date-fns-tz";
import { type ReactElement } from "react";
import { FaEdit, FaArchive, FaTrash } from "react-icons/fa";

export type FooterActionsProps = {
  lastUpdated: string;
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
      className={`flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0 ${className}`}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Last updated:</span>
        <span className="font-medium">
          {format(new Date(lastUpdated), "MMM d 'at' h:mm a")}
        </span>
      </div>

      {/* action buttons */}
      <div className="flex items-center gap-3">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-sm transition-colors duration-200 border border-blue-200 dark:border-blue-800 hover:cursor-pointer"
          >
            <FaEdit className="w-4 h-4" />
            {editLabel}
          </button>
        )}

        {onArchive && (
          <button
            onClick={onArchive}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-sm transition-colors duration-200 border border-gray-300 dark:border-gray-600 hover:cursor-pointer"
          >
            <FaArchive className="w-4 h-4" />
            {archiveLabel}
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-sm transition-colors duration-200 hover:cursor-pointer"
          >
            <FaTrash className="w-4 h-4" />
            {deleteLabel}
          </button>
        )}
      </div>
    </div>
  );
}
