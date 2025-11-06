import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import PreviewImage from "../../../../../teacher/pages/assessments/builder/preview/PreviewImage";
import PreviewText from "../../../../../teacher/pages/assessments/builder/preview/PreviewText";
import AssessmentQuestion from "./AssessmentQuestion";
import { IoDocumentText, IoFileTray, IoInformation } from "react-icons/io5";
import { Card, CardContent } from "../../../../../../components/ui/card";
import { Badge } from "../../../../../../components/ui/badge";

export default function AssessmentContent(): ReactElement {
  const { currentAssessment, currentPage, studentAnswers, setStudentAnswer } =
    usePreview();

  if (!currentAssessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center max-w-sm border-dashed">
          <CardContent className="p-6">
            <IoInformation className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No assessment loaded</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPageData = currentAssessment.pages[currentPage];

  if (!currentPageData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="text-center max-w-sm border-dashed">
          <CardContent className="p-6">
            <IoFileTray className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Page not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[] | Record<string, string> | boolean,
  ): void => {
    setStudentAnswer(questionId, answer);
  };

  const findStudentAnswer = (questionId: string) => {
    return studentAnswers.find((answer) => answer.questionId === questionId);
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-8">
      {currentPageData.title && (
        <Card className="mb-8 border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {currentPageData.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <IoDocumentText className="w-3 h-3" />
                    <span>
                      Page {currentPage + 1} of {currentAssessment.pages.length}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {currentPageData.contents.map((content, index) => {
          const studentAnswer = findStudentAnswer(content.id);

          switch (content.type) {
            case "question":
              return (
                <AssessmentQuestion
                  key={content.id}
                  content={content}
                  studentAnswer={studentAnswer}
                  onAnswerChange={(answer) =>
                    handleAnswerChange(content.id, answer.answer)
                  }
                  questionNumber={index + 1}
                />
              );
            case "image":
              return <PreviewImage key={content.id} content={content} />;
            case "text":
              return <PreviewText key={content.id} content={content} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
