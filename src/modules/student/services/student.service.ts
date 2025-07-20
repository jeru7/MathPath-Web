import axios from "axios";
import { URL } from "../../core/constants/api.constant";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../core/utils/api/api.util";
import {
  Student,
  StudentFormData,
} from "../../core/types/student/student.type";
import { StageAttempt } from "../../core/types/stage-attempt/stage-attempt.type";
import { ProgressLog } from "../../core/types/progress-log/progress-log.type";

// create student
export const createStudentService = async (studentData: StudentFormData) => {
  const res = await axios.post(`${URL}/api/web/students/`, studentData);

  return res.data;
};

export const useStudent = (studentId: string) => {
  return useQuery<Student>({
    queryKey: ["student", studentId, "student-data"],
    queryFn: () => {
      return fetchData<Student>(
        `${URL}/api/web/students/${studentId}`,
        "Failed to fetch student data.",
      );
    },
    enabled: !!studentId,
  });
};

export const useStudentAttempts = (studentId: string) => {
  return useQuery<StageAttempt[] | []>({
    queryKey: ["student", studentId, "attempts"],
    queryFn: () => {
      return fetchData<StageAttempt[] | []>(
        `${URL}/api/web/students/${studentId}/attempts`,
        "Failed to fetch student attempts.",
      );
    },
    enabled: !!studentId,
  });
};

export const useStudentProgressLog = (studentId: string) => {
  return useQuery<ProgressLog[] | []>({
    queryKey: ["student", studentId, "progress-log"],
    queryFn: () => {
      return fetchData<ProgressLog[] | []>(
        `${URL}/api/web/students/${studentId}/progress-logs`,
        "Failed to fetch student progress logs",
      );
    },
    enabled: !!studentId,
  });
};
