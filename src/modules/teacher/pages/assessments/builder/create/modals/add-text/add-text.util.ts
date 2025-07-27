import {
  AssessmentContent,
  TextContent,
} from "../../../../../../../core/types/assessment/assessment.type";

export const getDefaultText = (
  contentToEdit: AssessmentContent | null,
): TextContent => {
  if (!contentToEdit || contentToEdit.type !== "text") {
    return { text: "" };
  }

  const data = contentToEdit.data as string;

  return {
    text: data ? (contentToEdit.data as string) : "",
  };
};
