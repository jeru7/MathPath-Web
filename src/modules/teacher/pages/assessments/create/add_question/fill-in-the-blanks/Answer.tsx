import { type ReactElement } from "react";
import { FillInTheBlankAnswerType } from "../../../../../../core/types/assessment/assessment.types";

type AnswerProps = {
  answer: FillInTheBlankAnswerType;
};

export default function Answer({ answer }: AnswerProps): ReactElement {
  return (
    <article className="flex border border-gray-300 rounded-sm items-center">
      <div className="flex items-center justify-center p-2 border-r border-r-gray-300 rounded-s-xs">
        <p className="text-[var(--primary-green)] font-bold text-sm">
          {answer.label}
        </p>
      </div>
      <div className="flex items-center w-full p-2">
        <input
          type="text"
          placeholder="Type here..."
          className="outline-none w-full text-sm"
        />
      </div>
    </article>
  );
}
