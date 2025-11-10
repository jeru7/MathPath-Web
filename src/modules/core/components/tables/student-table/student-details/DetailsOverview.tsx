import { type ReactElement } from "react";
import { format } from "date-fns-tz";
import { Student } from "../../../../../student/types/student.type";
import { getSectionName } from "../../../../../teacher/pages/students/utils/student-table.util";
import { Section } from "../../../../types/section/section.type";

type DetailsOverviewProps = {
  student: Student;
  sections: Section[];
};

export default function DetailsOverview({
  student,
  sections,
}: DetailsOverviewProps): ReactElement {
  return (
    <div className="">
      <h3 className="font-semibold text-lg mb-4">Student Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">LRN:</span>
          <span className="font-medium">{student.referenceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium text-right">
            {student.lastName}, {student.firstName} {student.middleName}
          </span>
        </div>
        {/* email */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium">{student.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Section:</span>
          <span className="font-medium">
            {getSectionName(student.sectionId, sections)}
          </span>
        </div>
        {/* verification status */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Verification Status:</span>
          <span
            className={`font-medium ${student.verified?.verified ? "text-green-600" : "text-red-600"
              }`}
          >
            {student.verified?.verified ? "Verified" : "Not Verified"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Date Created:</span>
          <span className="font-medium text-right">
            {format(
              new Date(student.createdAt.toString()),
              "MMM d, yyyy 'at' h:mm a",
              {
                timeZone: "Asia/Manila",
              },
            )}
          </span>
        </div>
        {student.lastOnline && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Online:</span>
            <span className="font-medium">
              {format(new Date(student.lastOnline), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
        )}
        {student.characterName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Character Name:</span>
            <span className="font-medium">{student.characterName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
