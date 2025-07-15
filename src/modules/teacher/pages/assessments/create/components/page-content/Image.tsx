import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../../core/types/assessment/assessment.types";

type ImageProps = {
  content: AssessmentContent;
};

export default function Image({ content }: ImageProps): ReactElement {
  return (
    <figure className="flex flex-col items-center">
      <img
        src={content.data as string}
        alt="Uploaded content"
        className="max-w-full max-h-96 object-contain"
      />
    </figure>
  );
}
