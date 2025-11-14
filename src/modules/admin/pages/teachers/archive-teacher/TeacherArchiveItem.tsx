import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdCalendarToday } from "react-icons/md";
import { format } from "date-fns-tz";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Teacher } from "@/modules/teacher/types/teacher.type";
import { getProfilePicture } from "@/modules/core/utils/profile-picture.util";
import { TIMEZONE } from "@/modules/core/constants/date.constant";
import { ProfilePicture } from "@/modules/core/types/user.type";

type TeacherArchiveItemProps = {
  teacher: Teacher;
};

export default function TeacherArchiveItem({
  teacher,
}: TeacherArchiveItemProps): ReactElement {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:bg-muted/50 transition-colors duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* profile picture */}
            <div className="flex-shrink-0">
              <img
                src={getProfilePicture(
                  teacher.profilePicture as ProfilePicture,
                )}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border object-cover"
              />
            </div>

            {/* teacher details */}
            <div className="flex-1 min-w-0">
              {/* name */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {teacher.firstName}{" "}
                  {teacher.middleName && `${teacher.middleName} `}
                  {teacher.lastName}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {teacher.gender}
                </Badge>
              </div>

              {/* email */}
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <MdEmail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm truncate">{teacher.email}</p>
              </div>

              {/* archive date */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm">
                  Archived on{" "}
                  {format(
                    new Date(teacher.updatedAt),
                    "MMM d, yyyy 'at' h:mm a",
                    { timeZone: TIMEZONE },
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
