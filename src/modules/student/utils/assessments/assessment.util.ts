import { Assessment } from "../../../core/types/assessment/assessment.type";
import { Student } from "../../types/student.type";
import { AssessmentAttempt } from "../../../core/types/assessment-attempt/assessment-attempt.type";

export const canRetakeAssessment = (
  assessment: Assessment,
  student: Student | null,
  attempts: AssessmentAttempt[] = [],
): boolean => {
  if (!student || !assessment) return false;

  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed" || attempt.status === "failed",
  ).length;

  if (
    assessment.attemptLimit > 0 &&
    completedAttempts >= assessment.attemptLimit
  ) {
    return false;
  }

  const now = new Date();
  const startDate = assessment.date.start
    ? new Date(assessment.date.start)
    : null;
  const endDate = assessment.date.end ? new Date(assessment.date.end) : null;

  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;

  return true;
};

export const getCompletedAttemptsCount = (
  attempts: AssessmentAttempt[],
): number => {
  return attempts.filter(
    (attempt) => attempt.status === "completed" || attempt.status === "failed",
  ).length;
};

export const getTotalAttemptsCount = (
  attempts: AssessmentAttempt[],
): number => {
  return attempts.length;
};

export const getAssessmentStatus = (
  assessment: Assessment,
): "available" | "not-available" | "expired" => {
  switch (assessment.status) {
    case "draft":
      return "not-available";
    case "in-progress":
      return "available";
    case "published":
      return "not-available";
    case "finished":
      return "expired";
    default:
      return "not-available";
  }
};
