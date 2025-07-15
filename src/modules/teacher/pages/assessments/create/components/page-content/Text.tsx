import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";

type TextProps = {
  content: AssessmentContent;
};

export default function Text({ content }: TextProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const data = content.data as string;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      className={`flex gap-2 w-full max-w-full bg-white relative group ${isDragging ? "opacity-50" : ""}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      {/* control buttons */}
      <div className="absolute flex gap-2 right-0 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200 top-0">
        <button className="hover:text-gray-500 hover:cursor-pointer transition-colors duration-200">
          <FaRegEdit />
        </button>
        <div
          className="flex itemx-center justify-center hover:text-gray-500 hover:cursor-pointer transition-colors duration-200"
          {...listeners}
        >
          <MdDragIndicator />
        </div>
        <button className="hover:text-gray-500 hover:cursor-pointer transition-colors duration-200">
          <MdDeleteOutline />
        </button>
      </div>
      <div
        className={`flex flex-col w-full max-w-fullgap-4" ${isDragging ? "opacity-0" : ""}`}
      >
        <div
          className="break-words whitespace-normal w-full max-w-full pr-8"
          dangerouslySetInnerHTML={{
            __html: data,
          }}
        ></div>
      </div>
    </article>
  );
}
