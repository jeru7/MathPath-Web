import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { MdCalendarToday } from "react-icons/md";
import { format } from "date-fns-tz";
import { Assessment } from "../../types/assessment/assessment.type";
import { TIMEZONE } from "../../constants/date.constant";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type AssessmentArchiveItemProps = {
  assessment: Assessment;
};

export default function AssessmentArchiveItem({
  assessment,
}: AssessmentArchiveItemProps): ReactElement {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "in-progress":
        return "default";
      case "published":
        return "default";
      case "finished":
        return "default";
      default:
        return "secondary";
    }
  };

  // calculate total questions
  const totalQuestions =
    assessment.pages?.reduce((total, page) => {
      const questionCount = page.contents.filter(
        (content) => content.type === "question",
      ).length;
      return total + questionCount;
    }, 0) || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:bg-muted/50 transition-colors duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* assessment details */}
            <div className="flex-1 min-w-0">
              {/* title and status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                    {assessment.title || "Untitled Assessment"}
                  </h4>
                  {assessment.description && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {assessment.description}
                    </p>
                  )}
                </div>
                <Badge variant={getStatusVariant(assessment.status)}>
                  {assessment.status.replace("-", " ")}
                </Badge>
              </div>

              {/* topic and metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 flex-wrap">
                {assessment.topic && (
                  <p className="text-sm text-muted-foreground">
                    Topic: {assessment.topic}
                  </p>
                )}
                <Badge variant="outline" className="text-xs">
                  {assessment.sections?.length || 0} section
                  {(assessment.sections?.length || 0) !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {totalQuestions} question{totalQuestions !== 1 ? "s" : ""}
                </Badge>
                {assessment.timeLimit > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {assessment.timeLimit}m limit
                  </Badge>
                )}
              </div>

              {/* date information */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* archive date */}
                {assessment.archive.archiveDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <p className="text-xs sm:text-sm">
                      Archived on{" "}
                      {format(
                        new Date(assessment.archive.archiveDate),
                        "MMM d, yyyy 'at' h:mm a",
                        { timeZone: TIMEZONE },
                      )}
                    </p>
                  </div>
                )}

                {/* date range */}
                {(assessment.date.start || assessment.date.end) && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MdCalendarToday className="w-3 h-3 flex-shrink-0" />
                    <p className="text-xs">
                      {assessment.date.start && assessment.date.end
                        ? `${format(new Date(assessment.date.start), "MMM d", { timeZone: TIMEZONE })} - ${format(new Date(assessment.date.end), "MMM d, yyyy", { timeZone: TIMEZONE })}`
                        : assessment.date.start
                          ? `Starts ${format(new Date(assessment.date.start), "MMM d, yyyy", { timeZone: TIMEZONE })}`
                          : `Ends ${format(new Date(assessment.date.end!), "MMM d, yyyy", { timeZone: TIMEZONE })}`}
                    </p>
                  </div>
                )}
              </div>

              {/* created date */}
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <p className="text-xs">
                  Created:{" "}
                  {format(new Date(assessment.createdAt), "MMM d, yyyy", {
                    timeZone: TIMEZONE,
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
