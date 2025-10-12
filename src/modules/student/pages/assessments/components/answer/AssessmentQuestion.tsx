import { type ReactElement } from "react";
import {
  AssessmentContent,
  FillInTheBlankAnswerType,
  AssessmentQuestion as Question,
} from "../../../../../core/types/assessment/assessment.type";
import { StudentAnswer } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";

type StudentQuestionProps = {
  content: AssessmentContent;
  studentAnswer: StudentAnswer | undefined;
  onAnswerChange: (answer: StudentAnswer) => void;
  questionNumber?: number;
};

export default function AssessmentQuestion({
  content,
  studentAnswer,
  onAnswerChange,
  questionNumber,
}: StudentQuestionProps): ReactElement {
  const data = content.data as Question;

  const handleSingleChoiceChange = (choiceId: string): void => {
    onAnswerChange(choiceId);
  };

  const handleMultipleChoiceChange = (
    choiceId: string,
    isChecked: boolean,
  ): void => {
    const currentAnswers = Array.isArray(studentAnswer) ? studentAnswer : [];

    if (isChecked) {
      onAnswerChange([...currentAnswers, choiceId]);
    } else {
      onAnswerChange(currentAnswers.filter((id) => id !== choiceId));
    }
  };

  const handleTrueFalseChange = (value: boolean): void => {
    onAnswerChange(value.toString());
  };

  const handleIdentificationChange = (value: string): void => {
    onAnswerChange(value);
  };

  const handleFillInTheBlanksChange = (
    blankId: string,
    value: string,
  ): void => {
    const currentAnswers =
      typeof studentAnswer === "object" && !Array.isArray(studentAnswer)
        ? studentAnswer
        : {};

    onAnswerChange({
      ...currentAnswers,
      [blankId]: value,
    });
  };

  const renderSingleChoice = (): ReactElement => {
    if (data.type !== "single_choice") return <></>;

    return (
      <div className="space-y-3">
        {data.choices.map((choice) => (
          <label
            key={choice.id}
            className="flex items-center space-x-3 p-3 rounded-sm border border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <input
              type="radio"
              name={`question-${content.id}`}
              value={choice.id}
              checked={studentAnswer === choice.id}
              onChange={(e) => handleSingleChoiceChange(e.target.value)}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-2"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {choice.text}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderMultipleChoice = (): ReactElement => {
    if (data.type !== "multiple_choice") return <></>;

    return (
      <div className="space-y-3">
        {data.choices.map((choice) => (
          <label
            key={choice.id}
            className="flex items-center space-x-3 p-3 rounded-sm border border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <input
              type="checkbox"
              value={choice.id}
              checked={
                Array.isArray(studentAnswer)
                  ? studentAnswer.includes(choice.id)
                  : false
              }
              onChange={(e) =>
                handleMultipleChoiceChange(choice.id, e.target.checked)
              }
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 focus:ring-2"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {choice.text}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderTrueFalse = (): ReactElement => {
    if (data.type !== "true_or_false") return <></>;

    return (
      <div className="grid grid-cols-2 gap-3 max-w-xs">
        {[true, false].map((value) => (
          <label
            key={value.toString()}
            className="flex items-center space-x-3 p-3 rounded-sm border border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <input
              type="radio"
              name={`question-${content.id}`}
              value={value.toString()}
              checked={studentAnswer === value.toString()}
              onChange={() => handleTrueFalseChange(value)}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-2"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {value ? "True" : "False"}
            </span>
          </label>
        ))}
      </div>
    );
  };

  const renderIdentification = (): ReactElement => {
    if (data.type !== "identification") return <></>;

    return (
      <div className="max-w-md">
        <input
          type="text"
          value={typeof studentAnswer === "string" ? studentAnswer : ""}
          onChange={(e) => handleIdentificationChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
          placeholder="Enter your answer..."
        />
      </div>
    );
  };

  const renderFillInTheBlanks = (): ReactElement => {
    if (data.type !== "fill_in_the_blanks") return <></>;

    // parse the question and replace [number] with input fields
    const questionParts = data.question.split(/(\[\d+\])/);
    const blankAnswers =
      typeof studentAnswer === "object" && !Array.isArray(studentAnswer)
        ? studentAnswer
        : {};

    return (
      <div className="space-y-4">
        <div className="text-gray-900 dark:text-gray-100 mb-4 prose dark:prose-invert max-w-none text-lg leading-relaxed">
          {questionParts.map((part, index) => {
            // check if this part is a blank [number]
            const blankMatch = part.match(/\[(\d+)\]/);
            if (blankMatch) {
              const blankNumber = blankMatch[1];
              const blank = data.answers.find(
                (b: FillInTheBlankAnswerType) =>
                  b.label === blankNumber || b.id === blankNumber,
              );

              return (
                <span key={index} className="inline-flex items-center mx-2">
                  <input
                    type="text"
                    value={blankAnswers[blank?.id || ""] || ""}
                    onChange={(e) =>
                      handleFillInTheBlanksChange(
                        blank?.id || "",
                        e.target.value,
                      )
                    }
                    className="px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-700 min-w-20 text-center text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium"
                    placeholder={`${blank?.label || blankNumber}`}
                  />
                </span>
              );
            }

            return (
              <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuestionContent = (): ReactElement => {
    switch (data.type) {
      case "single_choice":
        return renderSingleChoice();
      case "multiple_choice":
        return renderMultipleChoice();
      case "true_or_false":
        return renderTrueFalse();
      case "identification":
        return renderIdentification();
      case "fill_in_the_blanks":
        return renderFillInTheBlanks();
      default:
        return (
          <div className="text-gray-500 dark:text-gray-400 italic p-4 bg-yellow-50 dark:bg-yellow-900 rounded-sm">
            Unsupported question type
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-white dark:border-gray-700 shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            {questionNumber && (
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-semibold text-sm">
                {questionNumber}
              </div>
            )}
            <div className="flex-1">
              {/* for fill-in-the-blanks, we render the question with input fields inline */}
              {data.type === "fill_in_the_blanks" ? (
                renderFillInTheBlanks()
              ) : (
                <div
                  className="text-gray-900 dark:text-gray-100 text-lg leading-relaxed prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.question }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="font-medium">
              {data.points} point{data.points !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="capitalize">{data.type.replace(/_/g, " ")}</span>
          </div>
        </div>

        {data.type !== "fill_in_the_blanks" && (
          <div className="mt-4">{renderQuestionContent()}</div>
        )}
      </div>
    </div>
  );
}
