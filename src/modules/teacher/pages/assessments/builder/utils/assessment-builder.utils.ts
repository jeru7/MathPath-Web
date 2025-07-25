import { isSameDay } from "date-fns";
import { AssessmentQuestion } from "../../../../../core/types/assessment/assessment.type";
import { sanitizeHtml } from "./sanitizeHtml";
import { CreateAssessmentDTO } from "../../../../../core/types/assessment/assessment.dto";

/**
 * Return the total score of all questions.
 * @function getTotalScore
 */
export const getTotalScore = (assessment: CreateAssessmentDTO): number => {
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
/**
 * Get the min time for the scheduled at date picker
 * @function getScheduleMinTime
 */
export const getScheduleMinTime = (scheduledAt: Date | null): Date => {
  const now = new Date();
  if (!scheduledAt) {
    return now;
  }

  return isSameDay(now, scheduledAt) ? now : new Date(0, 0, 0, 0, 0);
};
/**
 * Get the min time for the deadline at picker
 * @function getDeadlineMinTime
 */
export const getDeadlineMinTime = (
  scheduledAt: Date | null,
  deadlineAt: Date | null,
  timeLimit: number,
): Date => {
  if (!scheduledAt) return new Date(0, 0, 0, 0, 0);

  if (!deadlineAt || isSameDay(scheduledAt, deadlineAt)) {
    return new Date(scheduledAt.getTime() + (timeLimit + 5) * 60 * 1000);
  }

  return new Date(0, 0, 0, 0, 0);
};
