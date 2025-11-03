import { type ReactElement } from "react";
import {
  AssessmentContent,
  FillInTheBlankAnswerType,
  AssessmentQuestion as Question,
} from "../../../../../core/types/assessment/assessment.type";
import { StudentAnswer } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import { IoCheckmarkCircle, IoInformationCircle } from "react-icons/io5";

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
      <div className="space-y-2 sm:space-y-3">
        {data.choices.map((choice) => (
          <label
            key={choice.id}
            className="flex items-start sm:items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-sm border border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <input
              type="radio"
              name={`question-${content.id}`}
              value={choice.id}
              checked={studentAnswer === choice.id}
              onChange={(e) => handleSingleChoiceChange(e.target.value)}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-2 mt-1 sm:mt-0 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium break-words text-sm sm:text-base flex-1 min-w-0">
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
      <div className="space-y-2 sm:space-y-3">
        {data.choices.map((choice) => (
          <label
            key={choice.id}
            className="flex items-start sm:items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-sm border border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
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
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 focus:ring-2 mt-1 sm:mt-0 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium break-words text-sm sm:text-base flex-1 min-w-0">
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
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 max-w-full sm:max-w-xs">
        {[true, false].map((value) => (
          <label
            key={value.toString()}
            className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-sm border border-white dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <input
              type="radio"
              name={`question-${content.id}`}
              value={value.toString()}
              checked={studentAnswer === value.toString()}
              onChange={() => handleTrueFalseChange(value)}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 focus:ring-2 flex-shrink-0"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
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
      <div className="w-full max-w-full sm:max-w-md">
        <input
          type="text"
          value={typeof studentAnswer === "string" ? studentAnswer : ""}
          onChange={(e) => handleIdentificationChange(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 text-sm sm:text-base"
          placeholder="Enter your answer..."
        />
      </div>
    );
  };

  const renderFillInTheBlanks = (): ReactElement => {
    if (data.type !== "fill_in_the_blanks") return <></>;

    // parse the question and replace [number] with empty fields
    const questionParts = data.question.split(/(\[\d+\])/);
    const blankAnswers =
      typeof studentAnswer === "object" && !Array.isArray(studentAnswer)
        ? studentAnswer
        : {};

    // extract all blanks for the answer section
    const blanks = data.answers.map((blank: FillInTheBlankAnswerType) => ({
      ...blank,
      blankNumber: blank.label,
    }));

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* question text with empty fields */}
        <div className="text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none text-sm sm:text-base md:text-lg leading-relaxed break-words">
          {questionParts.map((part, index) => {
            const blankMatch = part.match(/\[(\d+)\]/);
            if (blankMatch) {
              const blankNumber = blankMatch[1];
              return (
                <span
                  key={index}
                  className="inline-flex items-center justify-center min-w-12 sm:min-w-16 mx-1 px-2 sm:px-3 py-1 sm:py-2 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded bg-transparent text-gray-600 dark:text-gray-400 select-none font-medium text-sm sm:text-base"
                  style={{ height: "2.25rem" }}
                >
                  {blankNumber}
                </span>
              );
            }
            return (
              <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
            );
          })}
        </div>

        {/* answer inputs section */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
            Provide answers for the blanks:
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {blanks.map((blank) => (
              <div
                key={blank.id}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-4 sm:min-w-6 flex-shrink-0">
                  {blank.blankNumber}.
                </span>
                <input
                  type="text"
                  value={blankAnswers[blank.id] || ""}
                  onChange={(e) =>
                    handleFillInTheBlanksChange(blank.id, e.target.value)
                  }
                  className="flex-1 min-w-0 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                  placeholder={`Answer ${blank.blankNumber}`}
                />
              </div>
            ))}
          </div>
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
          <div className="text-gray-500 dark:text-gray-400 italic p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900 rounded-sm text-sm sm:text-base">
            Unsupported question type
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-sm border border-white dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4 md:mb-6">
          {questionNumber && (
            <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full font-semibold text-xs sm:text-sm flex-shrink-0 mt-0.5">
              {questionNumber}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {data.type === "fill_in_the_blanks" ? (
              <div>{renderFillInTheBlanks()}</div>
            ) : (
              <div
                className="text-gray-900 dark:text-gray-100 text-sm sm:text-base md:text-lg leading-relaxed prose dark:prose-invert max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: data.question }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-400">
            <IoCheckmarkCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium">
              {data.points} point{data.points !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-400">
            <IoInformationCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="capitalize">{data.type.replace(/_/g, " ")}</span>
          </div>
        </div>

        {data.type !== "fill_in_the_blanks" && (
          <div className="mt-3 sm:mt-4">{renderQuestionContent()}</div>
        )}
      </div>
    </div>
  );
}
