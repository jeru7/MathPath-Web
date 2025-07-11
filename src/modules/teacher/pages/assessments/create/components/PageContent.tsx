import { type ReactElement } from "react";
import { AssessmentContent } from "../../../../../core/types/assessment/assessment.types";
import Question from "./page-content/Question";
import Image from "./page-content/Image";
import Text from "./page-content/Text";

type PageContentProps = {
  contents: AssessmentContent[];
  questionNumber: number;
};

export default function PageContent({
  contents,
  questionNumber,
}: PageContentProps): ReactElement {
  return (
    <section className="flex flex-col gap-4">
      {contents.map((content) => {
        if (content.type === "question") {
          const currentQuestionNumber = questionNumber;
          questionNumber++;

          return (
            <Question
              content={content}
              questionNumber={currentQuestionNumber}
            />
          );
        } else if (content.type === "image") {
          return <Image content={content} />;
        } else if (content.type === "text") {
          return <Text content={content} />;
        }
      })}
    </section>
  );
}
