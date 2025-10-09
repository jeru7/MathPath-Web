import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
  FillInTheBlankAnswerType,
} from "../../../../../core/types/assessment/assessment.type";

type PreviewQuestionProps = {
  content: AssessmentContent;
};

export default function PreviewQuestion({
  content,
}: PreviewQuestionProps): ReactElement {
  const data = content.data as AssessmentQuestion;

  // render fill in the blanks with actual blanks
  const renderFillInTheBlanksQuestion = (): ReactElement => {
    if (data.type !== "fill_in_the_blanks") return <></>;

    // parse the question and replace [number] with input fields
    const questionParts = data.question.split(/(\[\d+\])/);

    return (
      <div className="space-y-4">
        <div className="text-gray-900 dark:text-gray-100 mb-4 prose dark:prose-invert max-w-none">
          {questionParts.map((part, index) => {
            // check if this part is blank
            const blankMatch = part.match(/\[(\d+)\]/);
            if (blankMatch) {
              const blankNumber = blankMatch[1];
              const blank = data.answers.find(
                (b: FillInTheBlankAnswerType) =>
                  b.label === blankNumber || b.id === blankNumber,
              );

              return (
                <span key={index} className="inline-flex items-center mx-1">
                  <span className="px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 min-w-16 text-center text-gray-500 dark:text-gray-400 italic">
                    {blank?.label || blankNumber}
                  </span>
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

  // render answer key based on the question type
  const renderAnswerKey = (): ReactElement => {
    let singleChoiceAnswer;
    let multipleChoiceAnswers;
    let trueFalseAnswer;

    switch (data.type) {
      case "single_choice":
        singleChoiceAnswer = data.choices.find((choice) =>
          data.answers.includes(choice.id),
        );
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-sm border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Correct Answer:
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
              </div>
              <span className="text-green-700 dark:text-green-300 font-medium">
                {singleChoiceAnswer?.text || "No answer selected"}
              </span>
            </div>
          </div>
        );

      case "multiple_choice":
        multipleChoiceAnswers = data.choices.filter((choice) =>
          data.answers.includes(choice.id),
        );
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-sm border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Correct Answers:
            </h4>
            <div className="space-y-2">
              {multipleChoiceAnswers.map((choice) => (
                <div key={choice.id} className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-sm"></div>
                  </div>
                  <span className="text-green-700 dark:text-green-300">
                    {choice.text}
                  </span>
                </div>
              ))}
              {multipleChoiceAnswers.length === 0 && (
                <span className="text-green-700 dark:text-green-300 italic">
                  No answers selected
                </span>
              )}
            </div>
          </div>
        );

      case "true_or_false":
        trueFalseAnswer = data.answers === true ? "True" : "False";
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-sm border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Correct Answer:
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
              </div>
              <span className="text-green-700 dark:text-green-300 font-medium">
                {trueFalseAnswer}
              </span>
            </div>
          </div>
        );

      case "identification":
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-sm border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Correct Answer:
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-green-700 dark:text-green-300 font-medium bg-white dark:bg-green-800/30 px-3 py-1 rounded border border-green-200 dark:border-green-700">
                {data.answers}
              </span>
            </div>
          </div>
        );

      case "fill_in_the_blanks":
        return (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-sm border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
              Answer Key:
            </h4>
            <div className="space-y-2">
              {data.answers.map((blank: FillInTheBlankAnswerType) => (
                <div key={blank.id} className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-green-700 dark:text-green-300 min-w-20">
                    Blank {blank.label}:
                  </span>
                  <span className="text-green-600 dark:text-green-400 bg-white dark:bg-green-800/30 px-2 py-1 rounded border border-green-200 dark:border-green-700">
                    {blank.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <></>;
    }
  };

  const renderQuestionContent = (): ReactElement => {
    switch (data.type) {
      case "single_choice":
        return (
          <div className="space-y-3">
            {data.choices.map((choice) => (
              <div key={choice.id} className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {choice.text}
                </span>
              </div>
            ))}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-3">
            {data.choices.map((choice) => (
              <div key={choice.id} className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {choice.text}
                </span>
              </div>
            ))}
          </div>
        );

      case "true_or_false":
        return (
          <div className="space-y-3">
            {[true, false].map((value) => (
              <div
                key={value.toString()}
                className="flex items-center space-x-3"
              >
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {value ? "True" : "False"}
                </span>
              </div>
            ))}
          </div>
        );

      case "identification":
        return (
          <div className="w-full max-w-md px-3 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50">
            <span className="text-gray-500 dark:text-gray-400 italic">
              Answer field will appear here
            </span>
          </div>
        );

      case "fill_in_the_blanks":
        return renderFillInTheBlanksQuestion();

      default:
        return (
          <div className="text-gray-500 dark:text-gray-400 italic">
            Unsupported question type
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-sm border border-white dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* fill in the blanks: blank lines */}
          {data.type === "fill_in_the_blanks" ? (
            renderFillInTheBlanksQuestion()
          ) : (
            <div
              className="text-gray-900 dark:text-gray-100 mb-4 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: data.question }}
            />
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Points: {data.points}</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
              {data.type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>

      {data.type !== "fill_in_the_blanks" && renderQuestionContent()}

      {/* answer key */}
      <div className="mt-6">{renderAnswerKey()}</div>
    </div>
  );
}
