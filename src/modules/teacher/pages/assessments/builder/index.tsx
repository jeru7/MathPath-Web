import { type ReactElement } from "react";
import AssessmentBuilderProvider from "./context/AssessmentBuilderProvider";
import AssessmentBuilder from "./AssessmentBuilder";

export default function AssessmentBuilderWrapper(): ReactElement {
  return (
    <AssessmentBuilderProvider>
      <AssessmentBuilder />
    </AssessmentBuilderProvider>
  );
}
