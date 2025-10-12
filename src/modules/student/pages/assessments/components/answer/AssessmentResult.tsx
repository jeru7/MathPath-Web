import { type ReactElement, useState } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoArrowBack,
  IoRefresh,
  IoLockClosed,
  IoChevronDown,
  IoChevronUp,
  IoDocumentText,
  IoChevronForward,
  IoChevronBack,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import {
  Assessment,
  AssessmentQuestion,
  AssessmentPage,
} from "../../../../../core/types/assessment/assessment.type";
import {
  AssessmentAttempt,
  StudentAnswer,
} from "../../../../../core/types/assessment-attempt/assessment-attempt.type";

type AssessmentResultProps = {
  assessment: Assessment;
  attempt: AssessmentAttempt;
  onBack: () => void;
  onRetake?: () => void;
  canRetake?: boolean;
  attemptsUsed?: number;
};

// WARN: can be made as reusable util/helper
// render rich text
const renderRichText = (htmlContent: string) => {
  const createMarkup = () => {
    return { __html: htmlContent };
  };
  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
};

// type guards for discriminated union
const isChoiceQuestion = (
  question: AssessmentQuestion,
): question is Extract<
  AssessmentQuestion,
  { type: "single_choice" | "multiple_choice" }
> => {
  return (
    question.type === "single_choice" || question.type === "multiple_choice"
  );
};

const isFillInTheBlanksQuestion = (
  question: AssessmentQuestion,
): question is Extract<AssessmentQuestion, { type: "fill_in_the_blanks" }> => {
  return question.type === "fill_in_the_blanks";
};

const isTrueOrFalseQuestion = (
  question: AssessmentQuestion,
): question is Extract<AssessmentQuestion, { type: "true_or_false" }> => {
  return question.type === "true_or_false";
};

const isIdentificationQuestion = (
  question: AssessmentQuestion,
): question is Extract<AssessmentQuestion, { type: "identification" }> => {
  return question.type === "identification";
};

type QuestionWithPageInfo = AssessmentQuestion & {
  pageIndex: number;
  pageTitle: string;
};

type QuestionMappingResult = {
  totalPossiblePoints: number;
  questions: QuestionWithPageInfo[];
  questionAnswerMap: Map<string, string>;
  questionNumberMap: Map<string, number>;
};

export default function AssessmentResult({
  assessment,
  attempt,
  onBack,
  onRetake,
  canRetake = false,
  attemptsUsed = 1,
}: AssessmentResultProps): ReactElement {
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isPassed = attempt.status === "completed";

  const {
    questions,
    questionAnswerMap,
    questionNumberMap,
  }: QuestionMappingResult = assessment.pages.reduce(
    (acc: QuestionMappingResult, page: AssessmentPage, pageIndex: number) => {
      page.contents.forEach((content) => {
        if (content.type === "question") {
          const question = content.data;
          acc.totalPossiblePoints += question.points;

          const questionIndex = acc.questions.length;
          const answerKeys = Object.keys(attempt.answers);
          const answerKey =
            questionIndex < answerKeys.length
              ? answerKeys[questionIndex]
              : `q${questionIndex + 1}`;

          acc.questionAnswerMap.set(question.id, answerKey);
          acc.questionNumberMap.set(question.id, questionIndex + 1);

          const questionWithPageInfo: QuestionWithPageInfo = {
            ...question,
            pageIndex,
            pageTitle: page.title || `Page ${pageIndex + 1}`,
          };

          acc.questions.push(questionWithPageInfo);
        }
      });
      return acc;
    },
    {
      totalPossiblePoints: 0,
      questions: [] as QuestionWithPageInfo[],
      questionAnswerMap: new Map<string, string>(),
      questionNumberMap: new Map<string, number>(),
    },
  );

  const actualAttemptsUsed = attemptsUsed;

  const safeCanRetake: boolean =
    assessment.attemptLimit > 0 && actualAttemptsUsed >= assessment.attemptLimit
      ? false
      : canRetake;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getStatusIcon = (): ReactElement => {
    if (isPassed) {
      return <IoCheckmarkCircle className="w-12 h-12 text-green-500" />;
    }
    return <IoCloseCircle className="w-12 h-12 text-red-500" />;
  };

  const getStatusMessage = (): string => {
    if (isPassed) {
      return "Congratulations! You passed the assessment.";
    }
    return "You didn't pass this time. Keep practicing!";
  };

  const getStudentAnswer = (questionId: string): StudentAnswer | null => {
    const answerKey = questionAnswerMap.get(questionId);
    return answerKey ? attempt.answers[answerKey] : null;
  };

  const hasStudentAnswer = (questionId: string): boolean => {
    const answer = getStudentAnswer(questionId);
    if (!answer) return false;

    if (typeof answer === "string") return answer.trim() !== "";
    if (Array.isArray(answer))
      return answer.length > 0 && answer.some((a) => a && a.trim() !== "");
    if (typeof answer === "object" && !Array.isArray(answer))
      return Object.values(answer).some((val) => val && val.trim() !== "");

    return false;
  };

  const isAnswerCorrect = (
    question: AssessmentQuestion,
    questionId: string,
  ): boolean => {
    const studentAnswer = getStudentAnswer(questionId);
    if (!studentAnswer || !hasStudentAnswer(questionId)) return false;

    const correctAnswers = getCorrectAnswers(question);

    if (isFillInTheBlanksQuestion(question)) {
      // handle fill in the blanks
      if (typeof studentAnswer === "object" && !Array.isArray(studentAnswer)) {
        let allCorrect = true;
        question.answers.forEach((blank) => {
          const studentBlankAnswer = (studentAnswer as Record<string, string>)[
            blank.id
          ];
          const isBlankCorrect =
            studentBlankAnswer?.toLowerCase().trim() ===
            blank.value.toLowerCase().trim();
          if (!isBlankCorrect) {
            allCorrect = false;
          }
        });
        return allCorrect;
      } else {
        const studentAnswers = normalizeStudentAnswer(studentAnswer);
        if (studentAnswers.length !== correctAnswers.length) return false;
        return studentAnswers.every(
          (answer, index) =>
            answer?.toLowerCase().trim() ===
            correctAnswers[index]?.toLowerCase().trim(),
        );
      }
    } else {
      const studentAnswers = normalizeStudentAnswer(studentAnswer);

      switch (question.type) {
        case "single_choice":
          return (
            studentAnswers.length === 1 &&
            studentAnswers[0] === correctAnswers[0]
          );

        case "multiple_choice":
          if (studentAnswers.length !== correctAnswers.length) return false;
          return studentAnswers.every((answer) =>
            correctAnswers.includes(answer),
          );

        case "true_or_false":
          return studentAnswers[0] === correctAnswers[0];

        case "identification":
          return (
            studentAnswers[0]?.toLowerCase().trim() ===
            correctAnswers[0]?.toLowerCase().trim()
          );

        default:
          return false;
      }
    }
  };

  const getCorrectAnswers = (question: AssessmentQuestion): string[] => {
    if (isChoiceQuestion(question)) {
      return question.answers;
    } else if (isTrueOrFalseQuestion(question)) {
      return [question.answers.toString()];
    } else if (isIdentificationQuestion(question)) {
      return [question.answers];
    } else if (isFillInTheBlanksQuestion(question)) {
      return question.answers.map((answer) => answer.value);
    }
    return [];
  };

  const normalizeStudentAnswer = (answer: StudentAnswer): string[] => {
    if (typeof answer === "string") return [answer];
    if (Array.isArray(answer)) return answer;
    return [];
  };

  const correctAnswers: number = questions.filter(
    (question: QuestionWithPageInfo) => isAnswerCorrect(question, question.id),
  ).length;

  // get questions for current page
  const getCurrentPageQuestions = (): QuestionWithPageInfo[] => {
    return questions.filter(
      (q: QuestionWithPageInfo) => q.pageIndex === currentPage,
    );
  };

  const currentPageQuestions: QuestionWithPageInfo[] =
    getCurrentPageQuestions();
  const totalPages: number =
    Math.max(...questions.map((q: QuestionWithPageInfo) => q.pageIndex)) + 1;

  const handlePreviousPage = (): void => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = (): void => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const renderQuestionReview = (question: AssessmentQuestion): ReactElement => {
    const questionId: string = question.id;
    const studentAnswer: StudentAnswer | null = getStudentAnswer(questionId);
    const hasAnswer: boolean = hasStudentAnswer(questionId);
    const isCorrect: boolean = hasAnswer
      ? isAnswerCorrect(question, questionId)
      : false;
    const correctAnswers: string[] = getCorrectAnswers(question);
    const questionNumber: number | undefined =
      questionNumberMap.get(questionId);

    return (
      <div
        key={questionId}
        className="mb-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
      >
        {/* question header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Question {questionNumber}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({question.points} point{question.points !== 1 ? "s" : ""})
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 rich-text-content">
              {renderRichText(question.question)}
            </div>
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ml-4 ${
              hasAnswer
                ? isCorrect
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {hasAnswer ? (
              isCorrect ? (
                <IoCheckmarkCircle className="w-4 h-4" />
              ) : (
                <IoCloseCircle className="w-4 h-4" />
              )
            ) : null}
            {hasAnswer ? (isCorrect ? "Correct" : "Incorrect") : "Not Answered"}
          </div>
        </div>

        {/* answer */}
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Answer:
          </p>
          <div
            className={`p-3 rounded-lg ${
              hasAnswer
                ? isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
            }`}
          >
            {hasAnswer ? (
              renderStudentAnswer(question, studentAnswer)
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No answer provided
              </div>
            )}
          </div>
        </div>

        {/* correct answer */}
        {(!hasAnswer || !isCorrect) && (
          <div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correct Answer:
            </p>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              {renderCorrectAnswer(question, correctAnswers)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStudentAnswer = (
    question: AssessmentQuestion,
    studentAnswer: StudentAnswer | null,
  ): ReactElement => {
    if (!studentAnswer) {
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          No answer provided
        </div>
      );
    }

    if (isChoiceQuestion(question)) {
      const studentAnswers = normalizeStudentAnswer(studentAnswer);
      if (studentAnswers.length === 0) {
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
            No answer selected
          </div>
        );
      }
      return (
        <div className="space-y-2">
          {studentAnswers.map((answerId: string, index: number) => {
            const choice = question.choices.find((c) => c.id === answerId);
            return (
              <div
                key={index}
                className="text-sm text-gray-900 dark:text-gray-100"
              >
                {choice?.text || `Selected: ${answerId}`}
              </div>
            );
          })}
        </div>
      );
    } else if (isTrueOrFalseQuestion(question)) {
      const studentAnswers = normalizeStudentAnswer(studentAnswer);
      return (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {studentAnswers[0] === "true" ? "True" : "False"}
        </div>
      );
    } else if (isIdentificationQuestion(question)) {
      const studentAnswers = normalizeStudentAnswer(studentAnswer);
      return (
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {studentAnswers[0] || "No answer"}
        </div>
      );
    } else if (isFillInTheBlanksQuestion(question)) {
      if (Array.isArray(studentAnswer)) {
        return (
          <div className="space-y-2">
            {question.answers.map((blank, index: number) => (
              <div key={blank.id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-20">
                  {blank.label}:
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {studentAnswer[index] || "Empty"}
                </span>
              </div>
            ))}
          </div>
        );
      } else {
        const answerObj = studentAnswer as Record<string, string>;
        return (
          <div className="space-y-2">
            {question.answers.map((blank) => (
              <div key={blank.id} className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-20">
                  {blank.label}:
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {answerObj[blank.id] || "Empty"}
                </span>
              </div>
            ))}
          </div>
        );
      }
    } else {
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          Unknown question type
        </div>
      );
    }
  };

  const renderCorrectAnswer = (
    question: AssessmentQuestion,
    correctAnswers: string[],
  ): ReactElement => {
    if (isChoiceQuestion(question)) {
      return (
        <div className="space-y-2">
          {correctAnswers.map((answerId: string, index: number) => {
            const choice = question.choices.find((c) => c.id === answerId);
            return (
              <div
                key={index}
                className="text-sm text-green-700 dark:text-green-300"
              >
                {choice?.text || `Correct: ${answerId}`}
              </div>
            );
          })}
        </div>
      );
    } else if (isTrueOrFalseQuestion(question)) {
      return (
        <div className="text-sm text-green-700 dark:text-green-300">
          {correctAnswers[0] === "true" ? "True" : "False"}
        </div>
      );
    } else if (isIdentificationQuestion(question)) {
      return (
        <div className="text-sm text-green-700 dark:text-green-300">
          {correctAnswers[0]}
        </div>
      );
    } else if (isFillInTheBlanksQuestion(question)) {
      return (
        <div className="space-y-2">
          {question.answers.map((blank, index: number) => (
            <div key={blank.id} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-20">
                {blank.label}:
              </span>
              <span className="text-sm text-green-700 dark:text-green-300">
                {correctAnswers[index]}
              </span>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="text-sm text-green-700 dark:text-green-300">
          Unknown question type
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* header */}
        <div
          className={`p-6 ${isPassed ? "bg-green-500" : "bg-red-500"} text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon()}
              <div>
                <h1 className="text-2xl font-bold">Assessment Complete</h1>
                <p className="opacity-90">{getStatusMessage()}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <IoArrowBack className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* content */}
        <div className="p-6 space-y-4">
          {/* info */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {assessment.title}
            </h2>
            {assessment.topic && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {assessment.topic}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Correct
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(attempt.timeSpent)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Time
              </div>
            </div>
          </div>

          {/* attempt details */}
          {assessment.attemptLimit > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Attempts
                </span>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {actualAttemptsUsed}/{assessment.attemptLimit}
                </span>
              </div>
            </div>
          )}

          {/* detailed result toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <IoDocumentText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {showDetails ? "Hide" : "View"} detailed results (
                {questions.length} questions)
              </span>
            </div>
            {showDetails ? (
              <IoChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <IoChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>

          {/* detailed results */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                {/* page navigation */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <IoChevronBack className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Page {currentPage + 1} of {totalPages}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Next
                      <IoChevronForward className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* questions */}
                <div className="p-4 max-h-96 overflow-y-auto">
                  {currentPageQuestions.length > 0 ? (
                    currentPageQuestions.map((question: QuestionWithPageInfo) =>
                      renderQuestionReview(question),
                    )
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No questions on this page.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* completion date */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Completed on{" "}
            {new Date(
              attempt.dateCompleted || attempt.dateUpdated,
            ).toLocaleDateString()}{" "}
            at{" "}
            {new Date(
              attempt.dateCompleted || attempt.dateUpdated,
            ).toLocaleTimeString()}
          </div>

          {/* buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onBack}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex-1"
            >
              <IoArrowBack className="w-4 h-4" />
              <span>Back to Assessments</span>
            </button>

            {onRetake && safeCanRetake ? (
              <button
                onClick={onRetake}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex-1"
              >
                <IoRefresh className="w-4 h-4" />
                <span>Retake</span>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-400 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed font-medium flex-1"
              >
                <IoLockClosed className="w-4 h-4" />
                <span>Max Attempts</span>
              </button>
            )}
          </div>

          {/* attempt limit info */}
          {assessment.attemptLimit > 0 && !safeCanRetake && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-center">
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Maximum attempts ({assessment.attemptLimit}) reached
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
