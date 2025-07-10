import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
} from "../../../../../core/types/assessment/assessment.types";

type PageContentProps = {
  contentData: AssessmentContent;
};

export default function PageContent({
  contentData,
}: PageContentProps): ReactElement {
  const content = contentData.data as AssessmentQuestion;
  return <article>{content.question}</article>;
}
