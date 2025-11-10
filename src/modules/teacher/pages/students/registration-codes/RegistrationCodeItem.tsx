import { type ReactElement, useState } from "react";
import { RegistrationCode } from "../../../../core/types/registration-code/registration-code.type";
import { useTeacherContext } from "../../../context/teacher.context";
import { getSectionName } from "../utils/student-table.util";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/modules/core/utils/date.util";

type RegistrationCodeItemProps = {
  onClick: () => void;
  code: RegistrationCode;
};

export default function RegistrationCodeItem({
  onClick,
  code,
}: RegistrationCodeItemProps): ReactElement {
  const { rawSections } = useTeacherContext();
  const isActive = new Date() < new Date(code.expiresAt);

  // local state to track hover para sa motion
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:border-primary/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="font-bold text-lg font-mono">{code.code}</p>
            <p className="text-sm text-muted-foreground font-semibold">
              {getSectionName(code.sectionId, rawSections)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              variant={isActive ? "default" : "destructive"}
              className={isActive ? "bg-green-500" : ""}
            >
              {isActive ? "Active" : "Expired"}
            </Badge>
            <p className="text-muted-foreground font-semibold text-xs">
              {code.uses}/{code.maxUses} uses
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
              className="flex flex-col gap-1 mt-3 pt-3 border-t"
            >
              <p className="text-muted-foreground text-xs">
                Date created: {formatDate(code.createdAt.toString())}
              </p>

              <p className="text-muted-foreground text-xs">
                Date expiry: {formatDate(code.expiresAt.toString())}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
