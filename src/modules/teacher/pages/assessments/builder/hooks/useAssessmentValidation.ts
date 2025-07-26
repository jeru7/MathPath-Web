import { useMemo } from "react";
import {
  AssessmentPage,
  CreateAssessmentDTO,
} from "../../../../../core/types/assessment/assessment.type";

/**
 * Validate the top level of the assessment builder.
 * @function validateAssessment
 */
export const useAssessmentValidation = (
  assessment: CreateAssessmentDTO,
  step: 1 | 2 | 3,
) => {
  return useMemo(() => {
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
    }

    return errors;
  }, [assessment, step]);
};
