import { useQuery } from "@tanstack/react-query";
import { QuestList } from "../../core/types/quest/quest.type";
import { fetchData } from "../../core/utils/api/api.util";
import { BASE_URI } from "../../core/constants/api.constant";
import {
  AssessmentTracker,
  StageTracker,
} from "../../core/types/stats/trackers.type";

export const useStudentQuestListTracker = (studentId: string) => {
  return useQuery<QuestList>({
    queryKey: ["student", studentId, "quest-list"],
    queryFn: () => {
      return fetchData<QuestList>(
        `${BASE_URI}/api/web/students/${studentId}/trackers/quest-list`,
        "Failed to fetch student quest list.",
      );
    },
    enabled: !!studentId,
  });
};

export const useStudentAssessmentTracker = (studentId: string) => {
  return useQuery<AssessmentTracker>({
    queryKey: ["student", studentId, "assessment-tracker"],
    queryFn: () => {
      return fetchData<AssessmentTracker>(
        `${BASE_URI}/api/web/students/${studentId}/trackers/assessments`,
        "Failed to fetch student assessment tracker.",
      );
    },
    enabled: !!studentId,
  });
};

// get student stages tracker
export const useStudentStageTracker = (studentId: string) => {
  return useQuery<StageTracker>({
    queryKey: ["student", studentId, "stages-tracker"],
    queryFn: () => {
      return fetchData<StageTracker>(
        `${BASE_URI}/api/web/students/${studentId}/trackers/stages`,
        "Failed to fetch student stage tracker.",
      );
    },
    enabled: !!studentId,
  });
};
