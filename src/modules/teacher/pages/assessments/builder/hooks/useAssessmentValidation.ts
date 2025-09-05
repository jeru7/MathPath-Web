import { useMemo } from "react";
import {
  AssessmentPage,
  Assessment,
} from "../../../../../core/types/assessment/assessment.type";

/**
 * Validate the top level of the assessment builder.
 * @function validateAssessment
 */
export const useAssessmentValidation = (
  assessment: Assessment,
  step: 1 | 2 | 3,
) => {
  return useMemo(() => {
    const errors: Record<string, string | number[]> = {};
    if (step === 1) {
      const emptyPages: number[] = [];

      assessment.pages.forEach((page: AssessmentPage, index: number) => {
        const questionCount = page.contents.filter(
          (content) => content.type === "question",
        ).length;

        if (questionCount < 5) {
          emptyPages.push(index);
        }
      });

      if (emptyPages.length > 0) {
        errors.emptyPages = emptyPages;
        errors.pages = "Page must include at least 5 questions.";
      }
    }

    if (step === 2) {
      if (!assessment.title || assessment.title.trim().length === 0) {
        errors.title = "Title is required.";
      }
      if (!assessment.topic || assessment.topic.trim().length === 0) {
        errors.topic = "Topic is required.";
      }
      if (
        !assessment.description ||
        assessment.description.trim().length === 0
      ) {
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
      if (!assessment.date.end) {
        errors.endDate = "Deadline is required.";
      }
    }

    return errors;
  }, [assessment, step]);
};
