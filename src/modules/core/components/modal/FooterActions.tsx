import { format } from "date-fns-tz";
import { type ReactElement } from "react";
import { Edit, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 sm:py-4 border-t bg-background flex-shrink-0 gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-center sm:justify-start text-xs text-muted-foreground w-full sm:w-auto order-2 sm:order-1">
        <span className="mr-1">Last updated:</span>
        <span className="font-medium">
          {format(new Date(lastUpdated), "MMM d, yyyy 'at' h:mm a")}
        </span>
      </div>

      <div className="flex items-stretch w-full sm:w-auto gap-2 order-1 sm:order-2">
        {onEdit && !disableEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center text-foreground gap-2 flex-1 sm:flex-none bg-blue-400 dark:bg-blue-500 hover:bg-blue-400/50 hover:dark:bg-blue-500/80"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden xs:block">{editLabel}</span>
            <span className="xs:hidden">{editLabel}</span>
          </Button>
        )}

        {onArchive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            className="flex items-center text-foreground gap-2 flex-1 sm:flex-none bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-500/80 dark:hover:bg-yellow-600/80"
          >
            <Archive className="w-4 h-4" />
            <span className="hidden xs:block">{archiveLabel}</span>
            <span className="xs:hidden">{archiveLabel}</span>
          </Button>
        )}

        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden xs:block">{deleteLabel}</span>
            <span className="xs:hidden">{deleteLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
