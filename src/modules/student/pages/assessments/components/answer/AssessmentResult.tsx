import { type ReactElement, useState } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoArrowBack,
  IoRefresh,
  IoLockClosed,
  IoDocumentText,
} from "react-icons/io5";
import {
  Assessment,
  AssessmentQuestion,
  AssessmentPage,
} from "../../../../../core/types/assessment/assessment.type";
import {
  AssessmentAttempt,
  StudentAnswer,
} from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { Progress } from "../../../../../../components/ui/progress";
import AttemptReviewModal from "../assessment-attempt/AttemptReviewModal";
import { useStudentContext } from "@/modules/student/contexts/student.context";

type AssessmentResultProps = {
  assessment: Assessment;
  attempt: AssessmentAttempt;
  onBack: () => void;
  onRetake?: () => void;
  canRetake?: boolean;
  attemptsUsed?: number;
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
  const { student } = useStudentContext();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const isPassed = attempt.status === "completed";

  const { questions }: QuestionMappingResult = assessment.pages.reduce(
    (acc: QuestionMappingResult, page: AssessmentPage, pageIndex: number) => {
      page.contents.forEach((content) => {
        if (content.type === "question") {
          const question = content.data;
          acc.totalPossiblePoints += question.points;

          const questionIndex = acc.questions.length;

          let answerKey: string | null = null;

          // find the answer by questionid in the array
          const answerObj = attempt.answers.find(
            (answer) => answer.questionId === question.id,
          );
          if (answerObj) {
            answerKey = question.id;
          } else {
            // fallback: try to find by content id
            const answerByContentId = attempt.answers.find(
              (answer) => answer.questionId === content.id,
            );
            if (answerByContentId) {
              answerKey = content.id;
            } else if (questionIndex < attempt.answers.length) {
              // fallback: use index-based lookup
              answerKey =
                attempt.answers[questionIndex]?.questionId || question.id;
            } else {
              answerKey = question.id;
            }
          }

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
    const answerKey = attempt.answers.find(
      (answer) => answer.questionId === questionId,
    );
    return answerKey || null;
  };

  const hasStudentAnswer = (questionId: string): boolean => {
    const answer = getStudentAnswer(questionId);
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
  ): boolean => {
    const studentAnswer = getStudentAnswer(questionId);
    if (!studentAnswer || !hasStudentAnswer(questionId)) return false;

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

  const correctAnswers: number = questions.filter(
    (question: QuestionWithPageInfo) => isAnswerCorrect(question, question.id),
  ).length;

  const scorePercentage =
    questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        {/* header */}
        <CardHeader
          className={`p-6 text-white ${isPassed ? "bg-green-500" : "bg-red-500"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon()}
              <div>
                <CardTitle className="text-2xl">Assessment Complete</CardTitle>
                <p className="opacity-90">{getStatusMessage()}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <IoArrowBack className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* content */}
        <CardContent className="p-6 space-y-6">
          {/* info */}
          <div className="text-center">
            <h2 className="text-xl font-bold">{assessment.title}</h2>
            {assessment.topic && (
              <p className="text-muted-foreground text-sm">
                {assessment.topic}
              </p>
            )}
          </div>

          {/* score and time */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {correctAnswers}/{questions.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Correct Answers
                </div>
                <Progress value={scorePercentage} className="mt-2" />
                <div className="text-xs text-muted-foreground mt-1">
                  {scorePercentage.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {formatTime(attempt.timeSpent)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Time Spent
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Score: {attempt.score}/{assessment.passingScore} required
                </div>
              </CardContent>
            </Card>
          </div>

          {/* attempt details */}
          {assessment.attemptLimit > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Attempts Used</span>
                  <span className="font-medium">
                    {actualAttemptsUsed}/{assessment.attemptLimit}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* review button */}
          <Button
            onClick={() => setShowReviewModal(true)}
            variant="outline"
            className="w-full h-auto min-h-14 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-2 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 group hover:text-foreground"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
                <IoDocumentText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <span className="font-semibold text-sm sm:text-base block group-hover:text-foreground truncate">
                  Review Results
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 truncate">
                  {questions.length} questions
                </span>
              </div>
            </div>
            <div className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm font-medium rounded-full group-hover:bg-primary/20 group-hover:text-primary/90 flex-shrink-0 ml-2 sm:ml-4">
              View
            </div>
          </Button>

          {/* completion date */}
          <div className="text-center text-xs text-muted-foreground">
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
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center justify-center space-x-2 flex-1"
            >
              <IoArrowBack className="w-4 h-4" />
              <span>Back to Assessments</span>
            </Button>

            {onRetake && safeCanRetake ? (
              <Button
                onClick={onRetake}
                className="flex items-center justify-center space-x-2 flex-1"
              >
                <IoRefresh className="w-4 h-4" />
                <span>Retake</span>
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="flex items-center justify-center space-x-2 flex-1"
              >
                <IoLockClosed className="w-4 h-4" />
                <span>Max Attempts</span>
              </Button>
            )}
          </div>

          {/* attempt limit info */}
          {assessment.attemptLimit > 0 && !safeCanRetake && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Maximum attempts ({assessment.attemptLimit}) reached
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <AttemptReviewModal
        isOpen={showReviewModal}
        assessment={assessment}
        attempt={attempt}
        student={student}
        onClose={() => setShowReviewModal(false)}
      />
    </div>
  );
}
