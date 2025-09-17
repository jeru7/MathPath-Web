import { type ReactElement, useState } from "react";
import { RegistrationCode } from "../../../../core/types/registration-code/registration-code.type";
import { format } from "date-fns";
import { formatToPhDate } from "../../../../core/utils/date.util";
import { useTeacherContext } from "../../../context/teacher.context";
import { getSectionName } from "../utils/student-table.util";
import { AnimatePresence, motion } from "framer-motion";

type RegistrationCodeItemProps = {
  onClick: () => void;
  code: RegistrationCode;
};

export default function RegistrationCodeItem({
  onClick,
  code,
}: RegistrationCodeItemProps): ReactElement {
  const { sections } = useTeacherContext();
  const isActive = new Date() < new Date(code.expiresAt);

  // local state to track hover para sa motion
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="flex flex-col gap-4 border border-gray-300 rounded-sm px-2 py-2 opacity-80 hover:cursor-pointer hover:opacity-100 transition-all duration-200"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="font-bold text-lg">{code.code}</p>
          <p className="text-sm text-gray-400 font-semibold">
            {getSectionName(code.sectionId, sections)}
          </p>
        </div>

        <div className="flex flex-col items-center justify-between">
          <div
            className={`px-2 py-1 rounded-full ${
              isActive ? "bg-[var(--primary-green)]" : "bg-gray-400"
            } h-fit w-fit`}
          >
            <p className="text-xs text-white font-semibold">
              {isActive ? "Active" : "Expired"}
            </p>
          </div>
          <p className="text-gray-400 font-semibold text-xs">
            {code.uses}/{code.maxUses}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0.2 },
            }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0 } }}
            className="flex flex-col gap-1"
          >
            <p className="text-gray-400 text-xs">
              Date created:{" "}
              {format(
                formatToPhDate(code.createdAt.toString()),
                "MMMM d, yyyy 'at' hh:mm a",
              )}
            </p>

            <p className="text-gray-400 text-xs">
              Date expiry:{" "}
              {format(
                formatToPhDate(code.expiresAt.toString()),
                "MMMM d, yyyy 'at' hh:mm a",
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
