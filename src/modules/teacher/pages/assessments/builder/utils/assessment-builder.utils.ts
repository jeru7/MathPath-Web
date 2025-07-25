import { isSameDay } from "date-fns";
import {
  Assessment,
  AssessmentPage,
  AssessmentQuestion,
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

/**
 * Validate the top level of the assessment builder.
 * @function validateAssessment
 */
export const validateAssessment = (assessment: Assessment, step: 1 | 2 | 3) => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    const emptyPage: boolean = assessment.pages.some(
      (page: AssessmentPage) => page.contents.length === 0,
    );

    if (emptyPage) {
      errors.pages = "Page must include at least 1 content.";
    }
  }

  if (step === 2) {
    if (!assessment.title || assessment.title.trim().length === 0) {
      errors.title = "Title is required.";
    }
    if (!assessment.topic || assessment.topic.trim().length === 0) {
      errors.topic = "Topic is required.";
    }
    if (!assessment.description || assessment.description.trim().length === 0) {
      errors.description = "Description is required.";
    }
  }

  if (step === 3) {
    if (!assessment.date.start) {
      errors.startDate = "Scheduled at is required.";
    }
    if (assessment.sections.length === 0) {
      errors.sections = "Section list is empty.";
    }
  }

  return errors;
};
