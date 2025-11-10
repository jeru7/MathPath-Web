import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageProps = {
  content: AssessmentContent;
  onDeleteContent?: (content: AssessmentContent) => void;
  onEdit: () => void;
  isEditMode?: boolean;
};

export default function Image({
  content,
  onDeleteContent,
  onEdit,
  isEditMode = false,
}: ImageProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const { secureUrl } =
    content.type === "image"
      ? (content.data as { secureUrl: string; publicId: string })
      : { secureUrl: "" };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "border-primary shadow-lg scale-105",
        isEditMode && "bg-muted/50",
      )}
      {...attributes}
    >
      <CardContent className="p-4 flex items-center justify-center">
        {/* controls */}
        {!isEditMode && (
          <div className="absolute flex gap-1 top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <FaRegEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              {...listeners}
              className="h-8 w-8 cursor-grab"
            >
              <MdDragIndicator className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteContent?.(content)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <MdDeleteOutline className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* image */}
        <figure>
          <img
            src={secureUrl}
            alt="Uploaded content"
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </figure>
      </CardContent>
    </Card>
  );
}
