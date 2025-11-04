import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";

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
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  const { secureUrl } =
    content.type === "image"
      ? (content.data as { secureUrl: string; publicId: string })
      : { secureUrl: "" };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center justify-center w-full bg-white dark:bg-gray-800 group ${isDragging ? "opacity-50 z-10" : ""
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
          <button onClick={() => onDeleteContent?.(content)}>
            <MdDeleteOutline />
          </button>
        </div>
      )}

      {/* image */}
      <figure className={`${isDragging ? "opacity-0" : ""}`}>
        <img
          src={secureUrl}
          alt="Uploaded content"
          className="max-w-full max-h-96 object-contain"
        />
      </figure>
    </article>
  );
}
