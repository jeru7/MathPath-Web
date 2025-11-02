import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { MdCalendarToday } from "react-icons/md";
import { format } from "date-fns-tz";
import { Section } from "../../../types/section/section.type";
import { TIMEZONE } from "../../../constants/date.constant";
import { getSectionBanner } from "../../../utils/section/section.util";

type SectionArchiveItemProps = {
  section: Section;
};

export default function SectionArchiveItem({
  section,
}: SectionArchiveItemProps): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <div className="flex items-start gap-3">
        {/* section color indicator */}
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600`}
          >
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
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
              {section.name}
            </h4>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 w-fit">
              {section.teacherIds.length} teacher
              {section.teacherIds.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* archive date */}
          {section.archive?.archiveDate && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
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
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
            <p className="text-xs">
              Created:{" "}
              {format(new Date(section.createdAt), "MMM d, yyyy", {
                timeZone: TIMEZONE,
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
