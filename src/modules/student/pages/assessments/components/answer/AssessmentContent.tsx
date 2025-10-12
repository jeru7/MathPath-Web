import { type ReactElement } from "react";
import { usePreview } from "../../../../../core/contexts/preview/preview.context";
import PreviewImage from "../../../../../teacher/pages/assessments/builder/preview/PreviewImage";
import PreviewText from "../../../../../teacher/pages/assessments/builder/preview/PreviewText";
import AssessmentQuestion from "./AssessmentQuestion";
import { IoDocumentText, IoFileTray, IoInformation } from "react-icons/io5";
import { StudentAnswer } from "../../../../../core/types/assessment-attempt/assessment-attempt.type";

export default function AssessmentContent(): ReactElement {
  const { currentAssessment, currentPage, studentAnswers, setStudentAnswer } =
    usePreview();

  if (!currentAssessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <IoInformation className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No assessment loaded</p>
        </div>
      </div>
    );
  }

  const currentPageData = currentAssessment.pages[currentPage];

  if (!currentPageData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <IoFileTray className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Page not found</p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (
    questionId: string,
    answer: StudentAnswer,
  ): void => {
    setStudentAnswer(questionId, answer);
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-8">
      {currentPageData.title && (
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentPageData.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <IoDocumentText className="w-4 h-4" />
                  <span>
                    Page {currentPage + 1} of {currentAssessment.pages.length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {currentPageData.contents.map((content, index) => {
          switch (content.type) {
            case "question":
              return (
                <AssessmentQuestion
                  key={content.id}
                  content={content}
                  studentAnswer={studentAnswers[content.id]}
                  onAnswerChange={(answer: StudentAnswer) =>
                    handleAnswerChange(content.id, answer)
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
