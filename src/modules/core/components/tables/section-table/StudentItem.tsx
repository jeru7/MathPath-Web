import { useMemo, type ReactElement } from "react";
import { FaFire, FaGamepad } from "react-icons/fa";
import { FaEnvelope, FaUser } from "react-icons/fa6";
import { Student } from "../../../../student/types/student.type";
import { getProfilePicture } from "../../../utils/profile-picture.util";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type StudentItemProps = {
  student: Student;
  index: number;
  onStudentClick: (student: Student) => void;
};

export default function StudentItem({
  student,
  index,
  onStudentClick,
}: StudentItemProps): ReactElement {
  const progress = useMemo(() => {
    const totalStages = student.stages?.length || 0;
    const completedStages =
      student.stages?.filter((stage) => stage.completed)?.length || 0;
    const progress =
      totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    return {
      level: student.level || 1,
      progress,
      completedStages,
      totalStages,
      streak: student.streak || 0,
    };
  }, [student]);

  return (
    <Card
      className="flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 hover:border-primary/50 group"
      onClick={() => onStudentClick(student)}
    >
      {/* student number */}
      <div className="hidden sm:flex flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg items-center justify-center">
        <span className="text-sm font-semibold text-primary">{index + 1}</span>
      </div>

      {/* profile picture */}
      <div className="flex-shrink-0">
        {student.profilePicture ? (
          <img
            src={getProfilePicture(student.profilePicture)}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-10 h-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-border">
            <span className="text-sm font-semibold text-primary-foreground">
              {student.firstName[0]}
              {student.lastName[0]}
            </span>
          </div>
        )}
      </div>

      {/* student info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold truncate">
              {student.firstName} {student.lastName}
            </h4>
          </div>

          {/* level - mobile only */}
          <div className="flex items-center gap-1 sm:hidden">
            <FaGamepad className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold">{progress.level}</span>
          </div>
        </div>

        {/* email and gender */}
        <div className="hidden xs:flex items-center gap-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <FaEnvelope className="w-3 h-3" />
            <span className="truncate max-w-[120px]">{student.email}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUser className="w-3 h-3" />
            <span className="capitalize">{student.gender}</span>
          </div>
        </div>

        {/* stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1">
              <FaGamepad className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold">
                Lvl {progress.level}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {progress.completedStages}/{progress.totalStages} stages
              </span>
            </div>
          </div>

          {progress.streak > 0 && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700 hover:bg-orange-100"
            >
              <FaFire className="w-3 h-3 mr-1" />
              {progress.streak}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
