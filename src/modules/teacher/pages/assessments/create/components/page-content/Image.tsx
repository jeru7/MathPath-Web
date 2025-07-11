import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.types";

type ImageProps = {
  content: AssessmentContent;
};

export default function Image({ content }: ImageProps): ReactElement {
  return <article>{content.type === "question"}</article>;
}
