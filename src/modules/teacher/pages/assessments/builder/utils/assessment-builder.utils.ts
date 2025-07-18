import {
  Assessment,
  AssessmentQuestion,
} from "../../../../../core/types/assessment/assessment.types";
import { sanitizeHtml } from "./sanitizeHtml";

/**
 * Return the total score of all questions.
 * @function getTotalScore
 */
export const getTotalScore = (assessment: Assessment): number => {
  let totalScore: number = 0;
  assessment.pages.map((page) => {
    page.contents.map((content) => {
      if (content.type === "question") {
        const question = content.data as AssessmentQuestion;
        totalScore += question.points;
      }
    });
  });

  return totalScore;
};
/**
 * Changes the placeholder to lines.
 * @function renderBlanks
 */
export const renderBlanks = (text: string) => {
  const rawText = text.replace(/\[\d+\]/g, "_____________");
  return sanitizeHtml(rawText);
};
