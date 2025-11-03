import { useState, type ReactElement } from "react";
import Select, { SingleValue } from "react-select";
import BadgeItem from "./BadgeItem";
import {
  FilterOption,
  filterOptions,
} from "../../../../core/types/select.type";
import { getCustomSelectColor } from "../../../../core/styles/selectStyles";
import { Student, StudentBadge } from "../../../types/student.type";
import { useBadges } from "../../../../core/services/badge/badge.service";
import { Badge } from "../../../../core/types/badge/badge.type";

type BadgeListProps = {
  student: Student;
};

export default function BadgeList({ student }: BadgeListProps): ReactElement {
  const { data: badges } = useBadges();
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  // Get student's progress for a specific badge
  const getStudentBadgeProgress = (badgeId: string) => {
    const studentBadge = student.badges.find(
      (b: StudentBadge) => b.badgeId === badgeId,
    );
    if (!studentBadge) {
      return {
        completed: false,
        progress: 0,
        reqCompleted: 0,
        dateFinished: null,
      };
    }

    const badge = badges?.find((b) => b.id === badgeId);
    if (!badge) {
      return {
        completed: false,
        progress: 0,
        reqCompleted: studentBadge.reqCompleted,
        dateFinished: studentBadge.dateFinished,
      };
    }

    const progress = Math.min(
      (studentBadge.reqCompleted / badge.req) * 100,
      100,
    );
    const completed = studentBadge.dateFinished !== null;

    return {
      completed,
      progress,
      reqCompleted: studentBadge.reqCompleted,
      dateFinished: studentBadge.dateFinished,
    };
  };

  // Filter badges based on student progress and selected filter
  const getFilteredBadges = (): Badge[] => {
    if (!badges) return [];

    const filtered = badges.filter((badge: Badge) => {
      const progress = getStudentBadgeProgress(badge.id);

      switch (selectedFilter.value) {
        case "all":
          return true;
        case "completed":
          return progress.completed;
        case "not-completed":
          return !progress.completed;
        default:
          return true;
      }
    });

    return filtered;
  };

  const filteredBadges = getFilteredBadges();

  return (
    <article className="w-full h-full bg-white border border-white dark:border-gray-700 dark:bg-gray-800 rounded-lg sm:rounded-sm shadow-sm flex flex-col p-3 sm:p-4 overflow-hidden transition-colors duration-200">
      <div className="flex justify-between items-center mb-3 sm:mb-4 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg sm:text-base transition-colors duration-200">
          Badges
        </h3>
        <Select
          options={filterOptions}
          value={selectedFilter}
          onChange={(option: SingleValue<FilterOption>) => {
            if (option) setSelectedFilter(option);
          }}
          isMulti={false}
          styles={getCustomSelectColor<FilterOption>({
            borderRadius: "0.5rem",
            minHeight: "12px",
            menuWidth: "100%",
            dark: {
              backgroundColor: "#374151",
              textColor: "#f9fafb",
              borderColor: "#4b5563",
              borderFocusColor: "#10b981",
              optionHoverColor: "#374151",
              optionSelectedColor: "#059669",
              menuBackgroundColor: "#1f2937",
              placeholderColor: "#9ca3af",
            },
          })}
          className="w-28 sm:w-32 text-xs"
          isSearchable={false}
          menuPlacement="auto"
        />
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 h-full">
          <div className="flex gap-3 sm:gap-4 items-start h-full w-full">
            {filteredBadges.length > 0 ? (
              filteredBadges.map((badge: Badge) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  studentProgress={getStudentBadgeProgress(badge.id)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-32 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No badges found for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
