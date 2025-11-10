import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { MdCalendarToday } from "react-icons/md";
import { format } from "date-fns-tz";
import { Section } from "../../../../types/section/section.type";
import { TIMEZONE } from "../../../../constants/date.constant";
import { getSectionBanner } from "../../../../utils/section/section.util";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SectionArchiveItemProps = {
  section: Section;
};

export default function SectionArchiveItem({
  section,
}: SectionArchiveItemProps): ReactElement {
  const getBannerColor = (color: string): string => {
    const colorMap: Record<string, string> = {
      "primary-green": "bg-green-500",
      "tertiary-green": "bg-emerald-400",
      "primary-orange": "bg-orange-500",
      "primary-yellow": "bg-yellow-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:bg-muted/50 transition-colors duration-200">
        <CardContent className="p-0">
          <div className="flex">
            <div
              className={`w-3 rounded-l-sm ${getBannerColor(section.color)}`}
            />

            <div className="flex-1 p-4">
              <div className="flex items-start gap-3">
                {/* section banner */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border">
                    <img
                      src={getSectionBanner(section.banner)}
                      alt="Section banner"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>

                {/* section details */}
                <div className="flex-1 min-w-0">
                  {/* name and teacher count */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                        {section.name}
                      </h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {section.teacherIds.length} teacher
                      {section.teacherIds.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* archive date */}
                  {section.archive?.archiveDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <p className="text-xs sm:text-sm">
                        Archived on{" "}
                        {format(
                          new Date(section.archive.archiveDate),
                          "MMM d, yyyy 'at' h:mm a",
                          { timeZone: TIMEZONE },
                        )}
                      </p>
                    </div>
                  )}

                  {/* created date */}
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <p className="text-xs">
                      Created:{" "}
                      {format(new Date(section.createdAt), "MMM d, yyyy", {
                        timeZone: TIMEZONE,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
