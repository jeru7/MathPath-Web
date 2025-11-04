import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";

type TextProps = {
  content: AssessmentContent;
  onDeleteContent: (content: AssessmentContent) => void;
  onEdit: () => void;
  isEditMode?: boolean;
};

export default function Text({
  content,
  onDeleteContent,
  onEdit,
  isEditMode = false,
}: TextProps): ReactElement {
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
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  const data = content.data as string;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`relative flex flex-col w-full gap-4 bg-white dark:bg-gray-800 group ${isDragging ? "opacity-50 z-10" : ""
        }`}
      {...attributes}
    >
      {/* controls */}
      {!isEditMode && (
        <div className="absolute flex gap-2 top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-500 transition-all duration-200">
          <button onClick={onEdit}>
            <FaRegEdit />
          </button>
          <div {...listeners}>
            <MdDragIndicator />
          </div>
          <button onClick={() => onDeleteContent(content)}>
            <MdDeleteOutline />
          </button>
        </div>
      )}

      {/* text content */}
      <div
        className="break-words whitespace-normal w-full max-w-full pr-8 text-gray-900 dark:text-gray-200"
        dangerouslySetInnerHTML={{ __html: data }}
      />
    </article>
  );
}
