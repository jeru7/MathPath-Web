import { type ReactElement } from "react";
import Boy_1 from "../../../../../../assets/images/profilePictures/BOY_1.png";
import Boy_2 from "../../../../../../assets/images/profilePictures/BOY_2.png";
import Boy_3 from "../../../../../../assets/images/profilePictures/BOY_3.png";
import Boy_4 from "../../../../../../assets/images/profilePictures/BOY_4.png";
import Girl_1 from "../../../../../../assets/images/profilePictures/GIRL_1.png";
import Girl_2 from "../../../../../../assets/images/profilePictures/GIRL_2.png";
import Girl_3 from "../../../../../../assets/images/profilePictures/GIRL_3.png";
import Girl_4 from "../../../../../../assets/images/profilePictures/GIRL_4.png";
import { FaCircle } from "react-icons/fa";
import { StudentProfilePictures } from "../../../../../core/types/student/student.types";

export default function TeacherActivity(): ReactElement {
  return (
    <article className="flex gap-2 items-center py-2 border-b border-b-gray-300 justify-between">
      <div className="absolute left-0.5 w-4 h-4 bg-[var(--secondary-green)] rounded-full z-10 transform"></div>
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full">
          <img
            src={displayProfile("Boy_1")}
            alt="Student profile picture."
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-xs">
            John Emmanuel finished <span className="font-semibold">Quiz 1</span>
            .
          </p>
          <div className="text-gray-400 flex items-center gap-1">
            <p className="text-xs">3 mins ago</p>
            <FaCircle className="w-1 h-1" />
            <p className="text-xs">Assessment</p>
          </div>
        </div>
      </div>
    </article>
  );
}

const displayProfile = (profile: StudentProfilePictures): string => {
  switch (profile) {
    case "Boy_1":
      return Boy_1;
    case "Boy_2":
      return Boy_2;
    case "Boy_3":
      return Boy_3;
    case "Boy_4":
      return Boy_4;
    case "Girl_1":
      return Girl_1;
    case "Girl_2":
      return Girl_2;
    case "Girl_3":
      return Girl_3;
    case "Girl_4":
      return Girl_4;
    default:
      return Boy_1;
  }
};
