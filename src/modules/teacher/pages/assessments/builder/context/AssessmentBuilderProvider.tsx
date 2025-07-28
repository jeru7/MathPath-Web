import { type ReactElement, useReducer } from "react";
import { AssessmentBuilderContext } from "./assessment-builder.context";
import { assessmentBuilderReducer } from "./assessment-builder.reducer";
import { Assessment } from "../../../../../core/types/assessment/assessment.type";

export default function AssessmentBuilderProvider({
  children,
  initialAssessment,
}: {
  children: React.ReactNode;
  initialAssessment: Assessment;
}): ReactElement {
  const [state, dispatch] = useReducer(
    assessmentBuilderReducer,
    initialAssessment,
  );

  return (
    <AssessmentBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentBuilderContext.Provider>
  );
}
