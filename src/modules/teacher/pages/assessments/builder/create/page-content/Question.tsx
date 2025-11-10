import { type ReactElement } from "react";
import {
  AssessmentContent,
  AssessmentQuestion,
} from "../../../../../../core/types/assessment/assessment.type";
import { FaRegCircle, FaRegEdit } from "react-icons/fa";
import { GrCheckbox } from "react-icons/gr";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteOutline, MdDragIndicator } from "react-icons/md";
import { UniqueIdentifier } from "@dnd-kit/core";
import { renderBlanks } from "../../utils/assessment-builder.util";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuestionProps = {
  content: AssessmentContent;
  questionNumber: number;
  activeId: UniqueIdentifier | null;
  onDeleteContent: (content: AssessmentContent) => void;
  onEdit: () => void;
  isEditMode?: boolean;
};

export default function Question({
  content,
  questionNumber,
  onDeleteContent,
  onEdit,
  isEditMode = false,
}: QuestionProps): ReactElement {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: content.id });

  const data = content.data as AssessmentQuestion;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "border-primary shadow-lg scale-105",
        isEditMode && "bg-muted/50",
      )}
      {...attributes}
    >
      <CardContent className="p-4">
        {/* controls */}
        {!isEditMode && (
          <div className="absolute flex gap-1 top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <FaRegEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              {...listeners}
              className="h-8 w-8 cursor-grab"
            >
              <MdDragIndicator className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteContent(content)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <MdDeleteOutline className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* question content */}
        <div
          className={cn(
            "flex gap-3 w-full max-w-full",
            data.type === "fill_in_the_blanks" ? "" : "flex-col",
          )}
        >
          {/* question number */}
          <p
            className={cn(
              "font-semibold text-foreground flex-shrink-0",
              (questionNumber === 0 || isDragging) && "opacity-0",
            )}
          >
            {questionNumber}.
          </p>

          <div
            className={cn(
              "flex flex-col w-full max-w-full",
              data.type === "fill_in_the_blanks" ? "" : "gap-4",
            )}
          >
            <div
              className="break-words whitespace-normal w-full max-w-full pr-10 text-foreground"
              dangerouslySetInnerHTML={{
                __html:
                  data.type === "fill_in_the_blanks"
                    ? renderBlanks(data.question)
                    : data.question,
              }}
            />

            {/* choices */}
            <div>
              {data.type === "single_choice" && (
                <ul className="flex flex-col gap-2 max-w-full w-full">
                  {data.choices.map((choice) => (
                    <li key={choice.id} className="flex gap-2 items-start">
                      <FaRegCircle className="w-4 h-4 mt-[2px] text-muted-foreground flex-shrink-0" />
                      <p className="text-sm w-full max-w-full break-words whitespace-normal text-muted-foreground">
                        {choice.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {data.type === "multiple_choice" && (
                <ul className="flex flex-col gap-2">
                  {data.choices.map((choice) => (
                    <li key={choice.id} className="flex gap-2 items-start">
                      <GrCheckbox className="text-muted-foreground mt-[2px] flex-shrink-0" />
                      <p className="text-sm text-muted-foreground break-words whitespace-normal">
                        {choice.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {data.type === "identification" && (
                <p className="text-sm text-muted-foreground">
                  Answer: _____________
                </p>
              )}

              {data.type === "true_or_false" && (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <FaRegCircle className="text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">True</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <FaRegCircle className="text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">False</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
