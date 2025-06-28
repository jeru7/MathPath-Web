import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import * as studentService from "../../student/services/student.service";
import * as studentType from "../../core/types/student/student.types";
import { StudentContext } from "../context/StudentContext";
import { StageAttempt } from "../../core/types/stage_attempt/stage_attempt.types";
import { ProgressLog } from "../../core/types/progress_log/progress_log.types";

export function useStudentContext() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext must be used only within the StudentProvider.",
    );
  }
  return context;
}
export const useStudentData = (studentId: string) => {
  return useQuery<studentType.Student>({
    queryKey: ["student", studentId, "student-data"],
    queryFn: () => studentService.getStudent(studentId),
    enabled: !!studentId,
  });
};

// get studet attempts
export const useStudentAttempts = (studentId: string) => {
  return useQuery<StageAttempt[]>({
    queryKey: ["student", studentId, "attempts"],
    queryFn: () => studentService.getStudentAttempts(studentId),
    enabled: !!studentId,
  });
};

// get student progress log
export const useStudentProgressLog = (studentId: string) => {
  return useQuery<ProgressLog[]>({
    queryKey: ["student", studentId, "progress-log"],
    queryFn: () => studentService.getStudentProgressLog(studentId),
    enabled: !!studentId,
  });
};
