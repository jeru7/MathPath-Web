import { ReactElement, useState, useEffect } from "react";
import {
  FaTimes,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Student } from "../../../../types/student.type";
import {
  Assessment,
  AssessmentQuestion,
  AssessmentPage,
} from "../../../../../core/types/assessment/assessment.type";
import {
  AssessmentAttempt,
  StudentAnswer,
} from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import ModalOverlay from "../../../../../core/components/modal/ModalOverlay";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AttemptReviewModalProps = {
  isOpen: boolean;
  assessment: Assessment | null;
  attempt: AssessmentAttempt | null;
  student: Student | null;
  onClose: () => void;
};

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
  contentId: string;
};

const isOldDataFormat = (attempt: AssessmentAttempt): boolean => {
  if (!attempt.answers || attempt.answers.length === 0) return false;

  const firstAnswer = attempt.answers[0];
  const hasQuestionId = "questionId" in firstAnswer;
  const hasAnswer = "answer" in firstAnswer;

  const nonMetadataKeys = Object.keys(firstAnswer).filter(
    (key) => key !== "_id" && key !== "id",
  );

  return !hasQuestionId && !hasAnswer && nonMetadataKeys.length > 0;
};

const convertOldDataToNewFormat = (
  attempt: AssessmentAttempt,
): AssessmentAttempt => {
  if (!isOldDataFormat(attempt)) return attempt;

  const convertedAnswers: StudentAnswer[] = [];

  // NOTE: di ko na makuha yung type nung old data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attempt.answers.forEach((oldAnswer: any) => {
    Object.keys(oldAnswer).forEach((key) => {
      if (key === "_id" || key === "id") return;

      const answerValue = oldAnswer[key];
      convertedAnswers.push({
        questionId: key,
        answer: answerValue,
      });
    });
  });

  return {
    ...attempt,
    answers: convertedAnswers,
  };
};

export default function AttemptReviewModal({
  isOpen,
  assessment,
  attempt,
  student,
  onClose,
}: AttemptReviewModalProps): ReactElement {
  const [currentPage, setCurrentPage] = useState(0);
  const [questions, setQuestions] = useState<QuestionWithPageInfo[]>([]);
  const [normalizedAttempt, setNormalizedAttempt] =
    useState<AssessmentAttempt | null>(null);

  useEffect(() => {
    if (assessment && attempt) {
      const normalized = convertOldDataToNewFormat(attempt);
      setNormalizedAttempt(normalized);

      const allQuestions: QuestionWithPageInfo[] = [];

      assessment.pages.forEach((page: AssessmentPage, pageIndex: number) => {
        page.contents.forEach((content) => {
          if (content.type === "question") {
            const question = content.data;
            const questionWithPageInfo: QuestionWithPageInfo = {
              ...question,
              pageIndex,
              pageTitle: page.title || `Page ${pageIndex + 1}`,
              contentId: content.id,
            };
            allQuestions.push(questionWithPageInfo);
          }
        });
      });

      setQuestions(allQuestions);
    }
  }, [assessment, attempt]);

  if (!assessment || !attempt || !student || !normalizedAttempt) {
    return (
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Unable to load attempt details.
            </p>
          </CardContent>
        </Card>
      </ModalOverlay>
    );
  }

  const totalPages = assessment.pages.length;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const getStudentAnswer = (
    questionId: string,
    contentId: string,
  ): StudentAnswer | null => {
    const directAnswer = normalizedAttempt.answers.find(
      (answer) => answer.questionId === questionId,
    );

    if (directAnswer) {
      return directAnswer;
    }

    const contentIdAnswer = normalizedAttempt.answers.find(
      (answer) => answer.questionId === contentId,
    );

    return contentIdAnswer || null;
  };

  const hasStudentAnswer = (questionId: string, contentId: string): boolean => {
    const answer = getStudentAnswer(questionId, contentId);
    if (!answer) return false;

    if (typeof answer.answer === "string") return answer.answer.trim() !== "";
    if (Array.isArray(answer.answer))
      return (
        answer.answer.length > 0 &&
        answer.answer.some((a) => a && a.trim() !== "")
      );
    if (typeof answer.answer === "object" && !Array.isArray(answer.answer))
      return Object.values(answer.answer).some(
        (val) => val && val.trim() !== "",
      );
    if (typeof answer.answer === "boolean") return true;

    return false;
  };

  const isAnswerCorrect = (
    question: AssessmentQuestion,
    questionId: string,
    contentId: string,
  ): boolean => {
    const studentAnswer = getStudentAnswer(questionId, contentId);
    if (!studentAnswer || !hasStudentAnswer(questionId, contentId))
      return false;

    const correctAnswers = getCorrectAnswers(question);

    if (isFillInTheBlanksQuestion(question)) {
      if (
        typeof studentAnswer.answer === "object" &&
        !Array.isArray(studentAnswer.answer)
      ) {
        let allCorrect = true;
        question.answers.forEach((blank) => {
          const studentBlankAnswer = (
            studentAnswer.answer as Record<string, string>
          )[blank.id];
          const isBlankCorrect =
            studentBlankAnswer?.toLowerCase().trim() ===
            blank.value.toLowerCase().trim();
          if (!isBlankCorrect) {
            allCorrect = false;
          }
        });
        return allCorrect;
      } else {
        const studentAnswers = normalizeStudentAnswer(studentAnswer.answer);
        if (studentAnswers.length !== correctAnswers.length) return false;
        return studentAnswers.every(
          (answer, index) =>
            answer?.toLowerCase().trim() ===
            correctAnswers[index]?.toLowerCase().trim(),
        );
      }
    } else {
      const studentAnswers = normalizeStudentAnswer(studentAnswer.answer);

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

  const normalizeStudentAnswer = (
    answer: string | string[] | Record<string, string> | boolean,
  ): string[] => {
    if (typeof answer === "string") return [answer];
    if (Array.isArray(answer)) return answer;
    if (typeof answer === "object" && !Array.isArray(answer)) {
      return Object.values(answer);
    }
    if (typeof answer === "boolean") return [answer.toString()];
    return [];
  };

  const renderQuestionReview = (question: QuestionWithPageInfo) => {
    const questionId = question.id;
    const contentId = question.contentId;
    const studentAnswer = getStudentAnswer(questionId, contentId);
    const hasAnswer = hasStudentAnswer(questionId, contentId);
    const isCorrect = hasAnswer
      ? isAnswerCorrect(question, questionId, contentId)
      : false;
    const correctAnswers = getCorrectAnswers(question);
    const questionNumber = questions.findIndex((q) => q.id === questionId) + 1;

    return (
      <Card key={questionId} className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold">
                  Question {questionNumber}
                </h3>
                <span className="text-xs text-muted-foreground">
                  ({question.points} point{question.points !== 1 ? "s" : ""})
                </span>
              </div>
              <div className="text-sm rich-text-content">
                {renderRichText(question.question)}
              </div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ml-4 ${hasAnswer
                  ? isCorrect
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
                }`}
            >
              {hasAnswer ? (
                isCorrect ? (
                  <FaCheck className="w-4 h-4" />
                ) : (
                  <FaTimes className="w-4 h-4" />
                )
              ) : null}
              {hasAnswer
                ? isCorrect
                  ? "Correct"
                  : "Incorrect"
                : "Not Answered"}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs font-medium mb-2">Your Answer:</p>
            <Card
              className={`${hasAnswer
                  ? isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-muted"
                }`}
            >
              <CardContent className="p-3">
                {hasAnswer ? (
                  renderStudentAnswer(question, studentAnswer)
                ) : (
                  <div className="text-sm text-muted-foreground italic">
                    No answer provided
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {(!hasAnswer || !isCorrect) && (
            <div>
              <p className="text-xs font-medium mb-2">Correct Answer:</p>
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-3">
                  {renderCorrectAnswer(question, correctAnswers)}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderStudentAnswer = (
    question: AssessmentQuestion,
    studentAnswer: StudentAnswer | null,
  ) => {
    if (!studentAnswer) {
      return (
        <div className="text-sm text-muted-foreground italic">
          No answer provided
        </div>
      );
    }

    if (isChoiceQuestion(question)) {
      const studentAnswers = normalizeStudentAnswer(studentAnswer.answer);
      if (studentAnswers.length === 0) {
        return (
          <div className="text-sm text-muted-foreground italic">
            No answer selected
          </div>
        );
      }
      return (
        <div className="space-y-2">
          {studentAnswers.map((answerId, index) => {
            const choice = question.choices.find((c) => c.id === answerId);
            return (
              <div key={index} className="text-sm">
                {choice?.text || `Selected: ${answerId}`}
              </div>
            );
          })}
        </div>
      );
    } else if (isTrueOrFalseQuestion(question)) {
      if (typeof studentAnswer.answer === "boolean") {
        return (
          <div className="text-sm">
            {studentAnswer.answer ? "True" : "False"}
          </div>
        );
      } else {
        const studentAnswers = normalizeStudentAnswer(studentAnswer.answer);
        return (
          <div className="text-sm">
            {studentAnswers[0] === "true" ? "True" : "False"}
          </div>
        );
      }
    } else if (isIdentificationQuestion(question)) {
      const studentAnswers = normalizeStudentAnswer(studentAnswer.answer);
      return <div className="text-sm">{studentAnswers[0] || "No answer"}</div>;
    } else if (isFillInTheBlanksQuestion(question)) {
      if (Array.isArray(studentAnswer.answer)) {
        const answerArray = studentAnswer.answer;
        return (
          <div className="space-y-2">
            {question.answers.map((blank, index: number) => (
              <div key={blank.id} className="flex items-center gap-2">
                <span className="text-xs font-medium min-w-20">
                  {blank.label}:
                </span>
                <span className="text-sm">{answerArray[index] || "Empty"}</span>
              </div>
            ))}
          </div>
        );
      } else {
        const answerObj = studentAnswer.answer as Record<string, string>;
        return (
          <div className="space-y-2">
            {question.answers.map((blank) => (
              <div key={blank.id} className="flex items-center gap-2">
                <span className="text-xs font-medium min-w-20">
                  {blank.label}:
                </span>
                <span className="text-sm">
                  {answerObj[blank.id] || "Empty"}
                </span>
              </div>
            ))}
          </div>
        );
      }
    } else {
      return (
        <div className="text-sm text-muted-foreground italic">
          Unknown question type
        </div>
      );
    }
  };

  const renderCorrectAnswer = (
    question: AssessmentQuestion,
    correctAnswers: string[],
  ) => {
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
              <span className="text-xs font-medium min-w-20">
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

  const currentPageData = assessment.pages[currentPage];
  const currentPageQuestions = questions.filter(
    (q) => q.pageIndex === currentPage,
  );

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <Card className="w-[100dvw] h-[100dvh] rounded-none md:w-[80dvw] md:h-[90dvh] md:rounded-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold">
              {assessment.title || "Untitled Assessment"} - Review
            </h2>
            <p className="text-sm text-muted-foreground">
              Attempt on{" "}
              {new Date(
                normalizedAttempt.dateCompleted ||
                normalizedAttempt.dateUpdated,
              ).toLocaleDateString()}{" "}
              • Score: {normalizedAttempt.score}
              {normalizedAttempt.score >= assessment.passingScore
                ? " • Passed"
                : " • Failed"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <FaTimes className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border-b bg-muted">
          <Button
            variant="ghost"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <FaChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm font-medium">
            Page {currentPage + 1} of {totalPages}
            {currentPageData.title && ` - ${currentPageData.title}`}
          </div>

          <Button
            variant="ghost"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-2"
          >
            Next
            <FaChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {currentPageData.contents.map((content) => {
              if (content.type === "text") {
                return (
                  <div
                    key={content.id}
                    className="prose dark:prose-invert max-w-none"
                  >
                    <div className="whitespace-pre-wrap rich-text-content">
                      {renderRichText(content.data)}
                    </div>
                  </div>
                );
              }

              if (content.type === "image") {
                return (
                  <div key={content.id} className="flex justify-center">
                    <img
                      src={content.data.secureUrl}
                      alt="Assessment visual"
                      className="max-w-full h-auto rounded-sm"
                    />
                  </div>
                );
              }

              if (content.type === "question") {
                const questionData = content.data;
                const fullQuestion = questions.find(
                  (q) => q.id === questionData.id && q.contentId === content.id,
                );
                if (fullQuestion) {
                  return renderQuestionReview(fullQuestion);
                }
                return null;
              }

              return null;
            })}
          </div>

          {currentPageQuestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              This page doesn't contain any questions.
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted">
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">
              Status:{" "}
              <span className="font-medium capitalize">
                {normalizedAttempt.status}
              </span>
            </div>
            <div className="text-muted-foreground">
              Time Spent:{" "}
              <span className="font-medium">
                {Math.floor(normalizedAttempt.timeSpent / 60)}m{" "}
                {normalizedAttempt.timeSpent % 60}s
              </span>
            </div>
            <div className="text-muted-foreground">
              Passing Score:{" "}
              <span className="font-medium">
                {assessment.passingScore} points
              </span>
            </div>
          </div>
        </div>
      </Card>
    </ModalOverlay>
  );
}
