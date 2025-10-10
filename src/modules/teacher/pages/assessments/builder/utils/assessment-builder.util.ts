import { isSameDay } from "date-fns";
import {
  AssessmentQuestion,
  Assessment,
} from "../../../../../core/types/assessment/assessment.type";
import { sanitizeHtml } from "./sanitizeHtml";
import { BuilderMode } from "../AssessmentBuilder";

/**
 * Return the total score of all questions.
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
 */
export const renderBlanks = (text: string) => {
  const rawText = text.replace(/\[\d+\]/g, "_____________");
  return sanitizeHtml(rawText);
};

/**
 * Rounds a date to the next 10 minute interval
 */
export const roundToNext10Minutes = (date: Date): Date => {
  const rounded = new Date(date);
  const minutes = rounded.getMinutes();

  if (minutes % 10 === 0) {
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
    return rounded;
  }

  const roundedMinutes = Math.ceil(minutes / 10) * 10;
  if (roundedMinutes === 60) {
    rounded.setHours(rounded.getHours() + 1);
    rounded.setMinutes(0);
  } else {
    rounded.setMinutes(roundedMinutes);
  }

  rounded.setSeconds(0);
  rounded.setMilliseconds(0);

  return rounded;
};

/**
 * Get the min time for the scheduled at date picker
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
 */
export const getDeadlineMinTime = (
  startDate: Date | null,
  timeLimit: number,
): Date => {
  if (!startDate) return new Date(0, 0, 0, 0, 0);

  // Calculate minimum deadline: start date + time limit
  const minDeadline = new Date(startDate.getTime() + timeLimit * 60 * 1000);

  // Ensure it's at least 10 minutes after start date
  const minTime = new Date(startDate);
  minTime.setMinutes(minTime.getMinutes() + 10);

  const calculatedDeadline = minDeadline > minTime ? minDeadline : minTime;

  // Round to next 10 min interval
  return roundToNext10Minutes(calculatedDeadline);
};

/**
 * Get the initial step based on the mode in the url
 */
export const getInitialStep = (mode: BuilderMode): 1 | 2 | 3 => {
  switch (mode) {
    case "create":
      return 1;
    case "configure":
      return 2;
    case "publish":
      return 3;
    default:
      return 1;
  }
};
