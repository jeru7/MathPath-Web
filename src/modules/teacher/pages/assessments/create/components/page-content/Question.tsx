import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
} from "../../../../../../core/types/assessment/assessment.types";
import { FaRegCircle } from "react-icons/fa";
import { GrCheckbox } from "react-icons/gr";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

type QuestionProps = {
  content: AssessmentContent;
  questionNumber: number;
};

export default function Question({
  content,
  questionNumber,
}: QuestionProps): ReactElement {
  const data = content.data as AssessmentQuestion;
  return (
    <article className="flex gap-2 pb-4 w-full max-w-full">
      <p className="font-semibold">{questionNumber}.</p>
      <div
        className={`flex flex-col w-full max-w-full ${data.type === "fill_in_the_blanks" ? "" : "gap-4"}`}
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
