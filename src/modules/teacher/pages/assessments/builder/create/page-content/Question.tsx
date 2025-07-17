import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
} from "../../../../../../core/types/assessment/assessment.types";
import { FaRegCircle, FaRegEdit } from "react-icons/fa";
import { GrCheckbox } from "react-icons/gr";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";
import { UniqueIdentifier } from "@dnd-kit/core";

type QuestionProps = {
  content: AssessmentContent;
  questionNumber: number;
  activeId: UniqueIdentifier | null;
  onDeleteContent: (content: AssessmentContent) => void;
  onEdit: () => void;
};

export default function Question({
  content,
  questionNumber,
  onDeleteContent,
  onEdit,
}: QuestionProps): ReactElement {
  // dnd methods
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  // assert data as assessment question
  const data = content.data as AssessmentQuestion;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    border: isDragging ? "2px solid var(--primary-green)" : "",
    backgroundColor: isDragging ? "var(--secondary-green)" : "",
  };

  return (
    <article
      className={`flex gap-2 w-full max-w-full bg-white relative group ${isDragging ? "opacity-50 z-10" : ""}`}
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
          type="button"
          onClick={() => onDeleteContent(content)}
        >
          <MdDeleteOutline />
        </button>
      </div>
      {/* number */}
      <p
        className={`font-semibold ${questionNumber === 0 || isDragging ? "opacity-0" : ""}`}
      >
        {questionNumber}.
      </p>
      {/* question */}
      <div
        className={`flex flex-col w-full max-w-full ${data.type === "fill_in_the_blanks" ? "" : "gap-4"} ${isDragging ? "opacity-0" : ""}`}
      >
        <div
          className="break-words whitespace-normal w-full max-w-full pr-8"
          dangerouslySetInnerHTML={{
            __html:
              data.type === "fill_in_the_blanks"
                ? renderBlanks(data.question)
                : data.question,
          }}
        ></div>
        {/* choices */}
        <div>
          {data.type === "single_choice" ? (
            <ul className="flex flex-col gap-1 max-w-full w-full">
              {data.choices.map((choice) => (
                <li key={choice.id} className="flex gap-2 items-start">
                  <FaRegCircle className="w-4 h-4 mt-[2px]" />
                  <p className="text-sm w-full max-w-[800px] break-words whitespace-normal">
                    {choice.text}
                  </p>
                </li>
              ))}
            </ul>
          ) : data.type === "multiple_choice" ? (
            <ul className="flex flex-col gap-1">
              {data.choices.map((choice) => (
                <li key={choice.id} className="flex gap-2 items-center">
                  <GrCheckbox />
                  <p className="text-sm">{choice.text}</p>
                </li>
              ))}
            </ul>
          ) : data.type === "identification" ? (
            <p className="text-sm">Answer: _____________</p>
          ) : data.type === "true_or_false" ? (
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <FaRegCircle />
                <p className="text-sm">True</p>
              </div>
              <div className="flex gap-2 items-center">
                <FaRegCircle />
                <p className="text-sm">False</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const renderBlanks = (text: string) => {
  const rawText = text.replace(/\[\d+\]/g, "_____________");
  return sanitizeHtml(rawText);
};
