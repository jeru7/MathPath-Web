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
};

export default function Text({
  content,
  onDeleteContent,
  onEdit,
}: TextProps): ReactElement {
  // dnd methods
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  // assert data as string (since this is a text)
  const data = content.data as string;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      className={`flex gap-2 w-full max-w-full bg-white dark:bg-gray-800 relative group ${isDragging ? "opacity-50 z-10" : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* control buttons */}
      <div className="absolute flex gap-2 right-0 text-gray-300 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200 top-0">
        <button
          className="hover:text-gray-500 dark:hover:text-gray-300 hover:cursor-pointer transition-colors duration-200"
          type="button"
          onClick={onEdit}
        >
          <FaRegEdit />
        </button>
        <div
          className="flex itemx-center justify-center hover:text-gray-500 dark:hover:text-gray-300 hover:cursor-pointer transition-colors duration-200"
          {...listeners}
        >
          <MdDragIndicator />
        </div>
        <button
          className="hover:text-gray-500 dark:hover:text-gray-300 hover:cursor-pointer transition-colors duration-200"
          onClick={() => onDeleteContent(content)}
        >
          <MdDeleteOutline />
        </button>
      </div>
      <div
        className={`flex flex-col w-full max-w-full gap-4 ${isDragging ? "opacity-0" : ""}`}
      >
        <div
          className="break-words whitespace-normal w-full max-w-full pr-8 text-gray-900 dark:text-gray-200"
          dangerouslySetInnerHTML={{
            __html: data,
          }}
        ></div>
      </div>
    </article>
  );
}
