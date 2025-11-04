import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
} from "../../../../../../core/types/assessment/assessment.type";
import { FaRegCircle, FaRegEdit } from "react-icons/fa";
import { GrCheckbox } from "react-icons/gr";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";
import { UniqueIdentifier } from "@dnd-kit/core";
import { renderBlanks } from "../../utils/assessment-builder.util";

type QuestionProps = {
  content: AssessmentContent;
  questionNumber: number;
  activeId: UniqueIdentifier | null;
  onDeleteContent: (content: AssessmentContent) => void;
  onEdit: () => void;
  isEditMode?: boolean;
};

export default function Question({
  content,
  questionNumber,
  onDeleteContent,
  onEdit,
  isEditMode = false,
}: QuestionProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const data = content.data as AssessmentQuestion;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`relative flex gap-2 w-full max-w-full bg-white dark:bg-gray-800 group ${isDragging ? "opacity-50 z-10" : ""
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

      {/* question number */}
      <p
        className={`font-semibold text-gray-900 dark:text-gray-200 ${questionNumber === 0 || isDragging ? "opacity-0" : ""}`}
      >
        {questionNumber}.
      </p>

      {/* question content */}
      <div
        className={`flex flex-col w-full max-w-full ${data.type === "fill_in_the_blanks" ? "" : "gap-4"} ${isDragging ? "opacity-0" : ""}`}
      >
        <div
          className="break-words whitespace-normal w-full max-w-full pr-8 text-gray-900 dark:text-gray-200"
          dangerouslySetInnerHTML={{
            __html:
              data.type === "fill_in_the_blanks"
                ? renderBlanks(data.question)
                : data.question,
          }}
        />

        {/* choices */}
        <div>
          {data.type === "single_choice" && (
            <ul className="flex flex-col gap-1 max-w-full w-full">
              {data.choices.map((choice) => (
                <li key={choice.id} className="flex gap-2 items-start">
                  <FaRegCircle className="w-4 h-4 mt-[2px] text-gray-700 dark:text-gray-300" />
                  <p className="text-sm w-full max-w-[800px] break-words whitespace-normal text-gray-700 dark:text-gray-300">
                    {choice.text}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {data.type === "multiple_choice" && (
            <ul className="flex flex-col gap-1">
              {data.choices.map((choice) => (
                <li key={choice.id} className="flex gap-2 items-center">
                  <GrCheckbox className="text-gray-700 dark:text-gray-300" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {choice.text}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {data.type === "identification" && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Answer: _____________
            </p>
          )}

          {data.type === "true_or_false" && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <FaRegCircle className="text-gray-700 dark:text-gray-300" />
                <p className="text-sm text-gray-700 dark:text-gray-300">True</p>
              </div>
              <div className="flex gap-2 items-center">
                <FaRegCircle className="text-gray-700 dark:text-gray-300" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  False
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
