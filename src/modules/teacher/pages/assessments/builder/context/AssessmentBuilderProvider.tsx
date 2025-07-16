import { type ReactElement, useReducer } from "react";
import { AssessmentBuilderContext } from "./assessment-builder.context";
import {
  assessmentBuilderReducer,
  initialAssessment,
} from "./assessment-builder.reducer";

export default function AssessmentBuilderProvider({
  children,
}: {
  children: React.ReactNode;
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
