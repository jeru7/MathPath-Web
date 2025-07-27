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
};

export default function Image({
  content,
  onDeleteContent,
  onEdit,
}: ImageProps): ReactElement {
  // dnd methods
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  // assert data as string (since this is imageUrl)
  const data = content.data as string;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      className={`flex gap-2 w-full max-w-full bg-white relative group items-center justify-center ${isDragging ? "opacity-50 z-10" : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* control buttons */}
      <div className="absolute flex gap-2 right-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 top-0">
        <button
          className="hover:text-gray-500 hover:cursor-pointer transition-colors duration-200"
          type="button"
          onClick={onEdit}
        >
          <FaRegEdit />
        </button>
        <div
          className="flex itemx-center justify-center hover:text-gray-500 hover:cursor-pointer transition-colors duration-200"
          {...listeners}
        >
          <MdDragIndicator />
        </div>
        <button
          className="hover:text-gray-500 hover:cursor-pointer transition-colors duration-200"
          onClick={() => onDeleteContent?.(content)}
        >
          <MdDeleteOutline />
        </button>
      </div>
      {/* image */}
      <figure
        className={`flex flex-col items-center ${isDragging ? "opacity-0" : ""}`}
      >
        <img
          src={data}
          alt="Uploaded content"
          className="max-w-full max-h-96 object-contain"
        />
      </figure>
    </article>
  );
}
