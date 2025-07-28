import { isSameDay } from "date-fns";
import {
  AssessmentQuestion,
  Assessment,
} from "../../../../../core/types/assessment/assessment.type";
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
  startDate: Date | null,
  endDate: Date | null,
  timeLimit: number,
): Date => {
  if (!startDate) return new Date(0, 0, 0, 0, 0);

  if (!endDate || isSameDay(startDate, endDate)) {
    const offset = timeLimit + 10;
    return new Date(startDate.getTime() + offset * 60 * 1000);
  }

  return new Date(0, 0, 0, 0, 0);
};
