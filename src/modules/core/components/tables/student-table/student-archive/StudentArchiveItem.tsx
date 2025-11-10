import { type ReactElement } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdCalendarToday } from "react-icons/md";
import { Student } from "../../../../../student/types/student.type";
import { format } from "date-fns-tz";
import { TIMEZONE } from "../../../../constants/date.constant";
import { getProfilePicture } from "../../../../utils/profile-picture.util";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StudentArchiveItemProps {
  student: Student;
}

export default function StudentArchiveItem({
  student,
}: StudentArchiveItemProps): ReactElement {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:bg-muted/50 transition-colors duration-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* profile picture */}
            <div className="flex-shrink-0">
              <img
                src={getProfilePicture(student.profilePicture)}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border object-cover"
              />
            </div>

            {/* student details */}
            <div className="flex-1 min-w-0">
              {/* name and reference number */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h4 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {student.firstName}{" "}
                  {student.middleName && `${student.middleName} `}
                  {student.lastName}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {student.referenceNumber}
                </Badge>
              </div>

              {/* email */}
              <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                <MdEmail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm truncate">{student.email}</p>
              </div>

              {/* archive date */}
              {student.archive?.archiveDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <p className="text-xs sm:text-sm">
                    Archived on{" "}
                    {format(
                      new Date(student.archive.archiveDate),
                      "MMM d, yyyy 'at' h:mm a",
                      { timeZone: TIMEZONE },
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
