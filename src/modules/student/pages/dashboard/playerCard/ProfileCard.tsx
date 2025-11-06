import { type ReactElement } from "react";
import { capitalizeWord } from "../../../../core/utils/string.util";
import { Student } from "../../../types/student.type";
import { useStudentSection } from "../../../services/student.service";
import { getProfilePicture } from "../../../../core/utils/profile-picture.util";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type ProfileCardProps = {
  student: Student;
};

export default function ProfileCard({
  student,
}: ProfileCardProps): ReactElement {
  const { data: section } = useStudentSection(student.id, student.sectionId);
  const currentExp = student?.exp.current ?? 0;
  const nextLevelExp = student?.exp.nextLevel ?? 1;
  const expPercentage = Math.round((currentExp / nextLevelExp) * 100);

  return (
    <Card className="w-full h-fit p-3">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="rounded-full border border-border h-12 w-12 overflow-hidden">
              <img
                src={getProfilePicture(student.profilePicture)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm truncate">
              {capitalizeWord(student?.firstName.toString())}{" "}
              {student?.middleName
                ? `${student.middleName.charAt(0).toUpperCase()}. `
                : ""}
              {capitalizeWord(student?.lastName.toString())}
            </h2>
            <p className="text-muted-foreground text-xs truncate">
              {section?.name}
            </p>
            <div className="flex gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                Student
              </Badge>
            </div>
          </div>

          {/* Level */}
          <div className="text-center">
            <div className="rounded-full bg-primary h-10 w-10 flex items-center justify-center">
              <p className="text-primary-foreground font-bold text-sm">
                {student?.level}
              </p>
            </div>
            <p className="text-muted-foreground text-xs mt-1">Level</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {expPercentage}%
            </span>
          </div>
          <Progress value={expPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentExp} EXP</span>
            <span>{nextLevelExp} EXP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
