import { useState, type ReactElement } from "react";
import BadgeItem from "./BadgeItem";
import { filterOptions } from "../../../../core/types/select.type";
import { Student, StudentBadge } from "../../../types/student.type";
import { useBadges } from "../../../../core/services/badge/badge.service";
import { Badge } from "../../../../core/types/badge/badge.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BadgeListProps = {
  student: Student;
};

export default function BadgeList({ student }: BadgeListProps): ReactElement {
  const { data: badges } = useBadges();
  const [selectedFilter, setSelectedFilter] = useState("all");

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
    const progress = badge
      ? Math.min((studentBadge.reqCompleted / badge.req) * 100, 100)
      : 0;

    return {
      completed: studentBadge.dateFinished !== null,
      progress,
      reqCompleted: studentBadge.reqCompleted,
      dateFinished: studentBadge.dateFinished,
    };
  };

  const getFilteredBadges = (): Badge[] => {
    if (!badges) return [];
    return badges.filter((badge) => {
      const progress = getStudentBadgeProgress(badge.id);
      switch (selectedFilter) {
        case "completed":
          return progress.completed;
        case "not-completed":
          return !progress.completed;
        default:
          return true;
      }
    });
  };

  const filteredBadges = getFilteredBadges();

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-1 px-3 pt-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-semibold">Badges</CardTitle>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-24 h-6 text-xs">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="overflow-x-auto flex h-full items-start">
          <div className="flex gap-2 h-full py-1 px-2">
            {filteredBadges.length > 0 ? (
              filteredBadges.map((badge: Badge) => (
                <BadgeItem
                  key={badge.id}
                  badge={badge}
                  studentProgress={getStudentBadgeProgress(badge.id)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-24 text-muted-foreground text-sm">
                No badges found for this filter.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
