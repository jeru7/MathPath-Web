import { createContext, useContext } from "react";
import { Assessment } from "../../../../../core/types/assessment/assessment.types";
import { AssessmentBuilderAction } from "./assessment-builder.reducer";

export const AssessmentBuilderContext = createContext<{
  state: Assessment;
  dispatch: React.Dispatch<AssessmentBuilderAction>;
} | null>(null);

export const useAssessmentBuilder = () => {
  const context = useContext(AssessmentBuilderContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
};
