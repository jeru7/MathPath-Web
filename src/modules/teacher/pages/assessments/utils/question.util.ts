import { AssessmentPage } from "../../../../core/types/assessment/assessment.types";

export const getStartingQuestionNumber = (
  targetPageId: string,
  pages: AssessmentPage[],
) => {
  let questionNumber = 1;
  for (const page of pages) {
    if (page.id === targetPageId) {
      return questionNumber;
    }
    const questionCountInPage = page.contents.filter(
      (content) => content.type === "question",
    ).length;
    questionNumber += questionCountInPage;
  }
  return questionNumber;
};
