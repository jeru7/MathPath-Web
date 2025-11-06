import { type ReactElement, useMemo } from "react";
import {
  AssessmentContent,
  FillInTheBlankAnswerType,
  AssessmentQuestion as Question,
} from "../../../../../core/types/assessment/assessment.type";
import { StudentAnswer } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";
import { IoCheckmarkCircle, IoInformationCircle } from "react-icons/io5";
import { Card, CardContent } from "../../../../../../components/ui/card";
import { Badge } from "../../../../../../components/ui/badge";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import { Checkbox } from "../../../../../../components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../../../components/ui/radio-group";

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

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const hasRandomizableChoices = (
    question: Question,
  ): question is Extract<
    Question,
    { type: "single_choice" | "multiple_choice" }
  > => {
    return (
      (question.type === "single_choice" ||
        question.type === "multiple_choice") &&
      "choices" in question &&
      "randomPosition" in question
    );
  };

  const randomizedChoices = useMemo(() => {
    if (hasRandomizableChoices(data) && data.randomPosition) {
      return shuffleArray(data.choices);
    }

    if (hasRandomizableChoices(data)) {
      return data.choices;
    }

    return [];
  }, [data]);

  const isRandomized = useMemo(() => {
    return hasRandomizableChoices(data) && data.randomPosition;
  }, [data]);

  const handleSingleChoiceChange = (choiceId: string): void => {
    onAnswerChange({
      questionId: content.id,
      answer: choiceId,
    });
  };

  const handleMultipleChoiceChange = (
    choiceId: string,
    isChecked: boolean,
  ): void => {
    const currentAnswers =
      studentAnswer && Array.isArray(studentAnswer.answer)
        ? studentAnswer.answer
        : [];

    if (isChecked) {
      onAnswerChange({
        questionId: content.id,
        answer: [...currentAnswers, choiceId],
      });
    } else {
      onAnswerChange({
        questionId: content.id,
        answer: currentAnswers.filter((id) => id !== choiceId),
      });
    }
  };

  const handleTrueFalseChange = (value: boolean): void => {
    onAnswerChange({
      questionId: content.id,
      answer: value,
    });
  };

  const handleIdentificationChange = (value: string): void => {
    onAnswerChange({
      questionId: content.id,
      answer: value,
    });
  };

  const handleFillInTheBlanksChange = (
    blankId: string,
    value: string,
  ): void => {
    const currentAnswers =
      studentAnswer &&
        typeof studentAnswer.answer === "object" &&
        !Array.isArray(studentAnswer.answer)
        ? (studentAnswer.answer as Record<string, string>)
        : {};

    onAnswerChange({
      questionId: content.id,
      answer: {
        ...currentAnswers,
        [blankId]: value,
      },
    });
  };

  const renderSingleChoice = (): ReactElement => {
    if (data.type !== "single_choice") return <></>;

    return (
      <RadioGroup
        value={
          typeof studentAnswer?.answer === "string" ? studentAnswer.answer : ""
        }
        onValueChange={handleSingleChoiceChange}
        className="space-y-2 sm:space-y-3"
      >
        {randomizedChoices.map((choice) => (
          <div
            key={choice.id}
            className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors duration-200"
          >
            <RadioGroupItem
              value={choice.id}
              id={`${content.id}-${choice.id}`}
            />
            <Label
              htmlFor={`${content.id}-${choice.id}`}
              className="font-normal text-sm sm:text-base flex-1 min-w-0 cursor-pointer break-words"
            >
              {choice.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const renderMultipleChoice = (): ReactElement => {
    if (data.type !== "multiple_choice") return <></>;

    return (
      <div className="space-y-2 sm:space-y-3">
        {randomizedChoices.map((choice) => (
          <div
            key={choice.id}
            className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors duration-200"
          >
            <Checkbox
              id={`${content.id}-${choice.id}`}
              checked={
                Array.isArray(studentAnswer?.answer)
                  ? studentAnswer.answer.includes(choice.id)
                  : false
              }
              onCheckedChange={(checked) =>
                handleMultipleChoiceChange(choice.id, checked as boolean)
              }
            />
            <Label
              htmlFor={`${content.id}-${choice.id}`}
              className="font-normal text-sm sm:text-base flex-1 min-w-0 cursor-pointer break-words"
            >
              {choice.text}
            </Label>
          </div>
        ))}
      </div>
    );
  };

  const renderTrueFalse = (): ReactElement => {
    if (data.type !== "true_or_false") return <></>;

    return (
      <RadioGroup
        value={studentAnswer?.answer?.toString() || ""}
        onValueChange={(value) => handleTrueFalseChange(value === "true")}
        className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 max-w-full sm:max-w-xs"
      >
        {[true, false].map((value) => (
          <div
            key={value.toString()}
            className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors duration-200"
          >
            <RadioGroupItem
              value={value.toString()}
              id={`${content.id}-${value}`}
            />
            <Label
              htmlFor={`${content.id}-${value}`}
              className="font-normal text-sm sm:text-base cursor-pointer"
            >
              {value ? "True" : "False"}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  };

  const renderIdentification = (): ReactElement => {
    if (data.type !== "identification") return <></>;

    return (
      <div className="w-full max-w-full sm:max-w-md">
        <Input
          type="text"
          value={
            typeof studentAnswer?.answer === "string"
              ? studentAnswer.answer
              : ""
          }
          onChange={(e) => handleIdentificationChange(e.target.value)}
          placeholder="Enter your answer..."
          className="text-sm sm:text-base"
        />
      </div>
    );
  };

  const renderFillInTheBlanks = (): ReactElement => {
    if (data.type !== "fill_in_the_blanks") return <></>;

    const questionParts = data.question.split(/(\[\d+\])/);
    const blankAnswers =
      studentAnswer &&
        typeof studentAnswer.answer === "object" &&
        !Array.isArray(studentAnswer.answer)
        ? (studentAnswer.answer as Record<string, string>)
        : {};

    const blanks = data.answers.map((blank: FillInTheBlankAnswerType) => ({
      ...blank,
      blankNumber: blank.label,
    }));

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="prose dark:prose-invert max-w-none text-sm sm:text-base md:text-lg leading-relaxed break-words">
          {questionParts.map((part, index) => {
            const blankMatch = part.match(/\[(\d+)\]/);
            if (blankMatch) {
              const blankNumber = blankMatch[1];
              return (
                <span
                  key={index}
                  className="inline-flex items-center justify-center min-w-12 sm:min-w-16 mx-1 px-2 sm:px-3 py-1 sm:py-2 border-2 border-dashed border-muted-foreground/50 rounded bg-transparent text-muted-foreground select-none font-medium text-sm sm:text-base"
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

        <div className="border-t border-border pt-3 sm:pt-4">
          <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
            Provide answers for the blanks:
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {blanks.map((blank) => (
              <Card key={blank.id} className="p-3 sm:p-4">
                <CardContent className="p-0 flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground min-w-4 sm:min-w-6 flex-shrink-0">
                    {blank.blankNumber}.
                  </span>
                  <Input
                    type="text"
                    value={blankAnswers[blank.id] || ""}
                    onChange={(e) =>
                      handleFillInTheBlanksChange(blank.id, e.target.value)
                    }
                    placeholder={`Answer ${blank.blankNumber}`}
                    className="flex-1 min-w-0 text-sm sm:text-base"
                  />
                </CardContent>
              </Card>
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
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-3 sm:p-4">
              <div className="text-muted-foreground italic text-sm sm:text-base">
                Unsupported question type
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-2 sm:space-x-3 mb-3 sm:mb-4 md:mb-6">
          {questionNumber && (
            <Badge className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-primary text-primary-foreground rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              {questionNumber}
            </Badge>
          )}
          <div className="flex-1 min-w-0">
            {data.type === "fill_in_the_blanks" ? (
              <div>{renderFillInTheBlanks()}</div>
            ) : (
              <div
                className="text-sm sm:text-base md:text-lg leading-relaxed prose dark:prose-invert max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: data.question }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm">
          <Badge
            variant="secondary"
            className="flex items-center space-x-1 sm:space-x-2 w-fit"
          >
            <IoCheckmarkCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>
              {data.points} point{data.points !== 1 ? "s" : ""}
            </span>
          </Badge>

          <Badge
            variant="outline"
            className="flex items-center space-x-1 sm:space-x-2 w-fit"
          >
            <IoInformationCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="capitalize">{data.type.replace(/_/g, " ")}</span>
            {isRandomized && (
              <span className="text-xs text-green-600 dark:text-green-400">
                (Randomized)
              </span>
            )}
          </Badge>
        </div>

        {data.type !== "fill_in_the_blanks" && (
          <div className="mt-3 sm:mt-4">{renderQuestionContent()}</div>
        )}
      </CardContent>
    </Card>
  );
}
