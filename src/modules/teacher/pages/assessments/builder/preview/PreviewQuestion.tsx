import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
  FillInTheBlankAnswerType,
} from "../../../../../core/types/assessment/assessment.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PreviewQuestionProps = {
  content: AssessmentContent;
};

export default function PreviewQuestion({
  content,
}: PreviewQuestionProps): ReactElement {
  const data = content.data as AssessmentQuestion;

  const renderFillInTheBlanksQuestion = (): ReactElement => {
    if (data.type !== "fill_in_the_blanks") return <></>;

    const questionParts = data.question.split(/(\[\d+\])/);

    return (
      <div className="space-y-4">
        <div className="text-foreground mb-4 prose dark:prose-invert max-w-none">
          {questionParts.map((part, index) => {
            const blankMatch = part.match(/\[(\d+)\]/);
            if (blankMatch) {
              const blankNumber = blankMatch[1];
              const blank = data.answers.find(
                (b: FillInTheBlankAnswerType) =>
                  b.label === blankNumber || b.id === blankNumber,
              );

              return (
                <span key={index} className="inline-flex items-center mx-1">
                  <span className="px-3 py-1 border-2 border-dashed border-muted-foreground/30 rounded-md bg-muted/50 min-w-16 text-center text-muted-foreground italic">
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
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              <div className="font-medium mb-2">Correct Answer:</div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
                </div>
                <span className="font-medium">
                  {singleChoiceAnswer?.text || "No answer selected"}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        );

      case "multiple_choice":
        multipleChoiceAnswers = data.choices.filter((choice) =>
          data.answers.includes(choice.id),
        );
        return (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              <div className="font-medium mb-2">Correct Answers:</div>
              <div className="space-y-2">
                {multipleChoiceAnswers.map((choice) => (
                  <div key={choice.id} className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-sm" />
                    </div>
                    <span>{choice.text}</span>
                  </div>
                ))}
                {multipleChoiceAnswers.length === 0 && (
                  <span className="italic">No answers selected</span>
                )}
              </div>
            </AlertDescription>
          </Alert>
        );

      case "true_or_false":
        trueFalseAnswer = data.answers === true ? "True" : "False";
        return (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              <div className="font-medium mb-2">Correct Answer:</div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-green-500 dark:border-green-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
                </div>
                <span className="font-medium">{trueFalseAnswer}</span>
              </div>
            </AlertDescription>
          </Alert>
        );

      case "identification":
        return (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              <div className="font-medium mb-2">Correct Answer:</div>
              <div className="flex items-center gap-3">
                <span className="font-medium bg-white dark:bg-green-800/30 px-3 py-1 rounded border border-green-200 dark:border-green-700">
                  {data.answers}
                </span>
              </div>
            </AlertDescription>
          </Alert>
        );

      case "fill_in_the_blanks":
        return (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              <div className="font-medium mb-2">Answer Key:</div>
              <div className="space-y-2">
                {data.answers.map((blank: FillInTheBlankAnswerType) => (
                  <div
                    key={blank.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="font-medium min-w-20">
                      Blank {blank.label}:
                    </span>
                    <span className="bg-white dark:bg-green-800/30 px-2 py-1 rounded border border-green-200 dark:border-green-700">
                      {blank.value}
                    </span>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
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
              <div key={choice.id} className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-muted-foreground/50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                </div>
                <span className="text-muted-foreground">{choice.text}</span>
              </div>
            ))}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-3">
            {data.choices.map((choice) => (
              <div key={choice.id} className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-muted-foreground/50 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-sm" />
                </div>
                <span className="text-muted-foreground">{choice.text}</span>
              </div>
            ))}
          </div>
        );

      case "true_or_false":
        return (
          <div className="space-y-3">
            {[true, false].map((value) => (
              <div key={value.toString()} className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-muted-foreground/50 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                </div>
                <span className="text-muted-foreground">
                  {value ? "True" : "False"}
                </span>
              </div>
            ))}
          </div>
        );

      case "identification":
        return (
          <div className="w-full max-w-md px-3 py-2 border-2 border-dashed border-muted-foreground/30 rounded-md bg-muted/50">
            <span className="text-muted-foreground italic">
              Answer field will appear here
            </span>
          </div>
        );

      case "fill_in_the_blanks":
        return renderFillInTheBlanksQuestion();

      default:
        return (
          <div className="text-muted-foreground italic">
            Unsupported question type
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          {/* question content */}
          {data.type === "fill_in_the_blanks" ? (
            renderFillInTheBlanksQuestion()
          ) : (
            <div
              className="text-foreground prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: data.question }}
            />
          )}

          {/* question metadata */}
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {data.points} point{data.points !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.type.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        {/* question options */}
        {data.type !== "fill_in_the_blanks" && renderQuestionContent()}

        {/* answer key */}
        <div>{renderAnswerKey()}</div>
      </CardContent>
    </Card>
  );
}
