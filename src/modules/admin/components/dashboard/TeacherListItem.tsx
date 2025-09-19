import { type ReactElement } from "react";
import { Teacher } from "../../../teacher/types/teacher.type";
import { getProfilePictures } from "../../../core/utils/profile-picture.util";

type TeacherListItemProps = {
  teacher: Teacher;
};
export default function TeacherListItem({
  teacher,
}: TeacherListItemProps): ReactElement {
  return (
    <li className="border border-gray-300 p-2 rounded-sm flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img
          src={getProfilePictures(teacher.profilePicture ?? "Default")}
          className="rounded-full w-12 h-12"
        />
        <p className="">
          {teacher.lastName}, {teacher.firstName}
        </p>
      </div>
    </li>
  );
}
