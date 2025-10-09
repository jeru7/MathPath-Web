import { type ReactElement, useReducer, useMemo } from "react";
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

  // memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <AssessmentBuilderContext.Provider value={contextValue}>
      {children}
    </AssessmentBuilderContext.Provider>
  );
}
