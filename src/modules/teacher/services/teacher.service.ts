import { Assessment } from "../../core/types/assessment/assessment.type";
import { Section } from "../../core/types/section/section.type";
import { Teacher } from "../../core/types/teacher/teacher.type";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../core/utils/api/api.util";
import { DATA_STALE_TIME, URL } from "../../core/constants/api.constant";
import { Student } from "../../student/types/student.type";

// get teacher data - teacher info
export const useTeacher = (teacherId: string) => {
  return useQuery<Teacher>({
    queryKey: ["teacher", teacherId],
    queryFn: () =>
      fetchData<Teacher>(
        `${URL}/api/web/teachers/${teacherId}`,
        "Failed to fetch teacher.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get teacher students
export const useTeacherStudents = (teacherId: string) => {
  return useQuery<Student[] | []>({
    queryKey: ["teacher", teacherId, "students"],
    queryFn: () => {
      return fetchData<Student[] | []>(
        `${URL}/api/web/teachers/${teacherId}/students`,
        "Failed to fetch student.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get teacher sections
export const useTeacherSections = (teacherId: string) => {
  return useQuery<Section[] | []>({
    queryKey: ["teacher", teacherId, "sections"],
    queryFn: () => {
      return fetchData<Section[] | []>(
        `${URL}/api/web/teachers/${teacherId}/sections`,
        "Failed to fetch sections",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get teacher assessments
export const useTeacherAssessments = (teacherId: string) => {
  return useQuery<Assessment[] | []>({
    queryKey: ["teacher", teacherId, "assessments"],
    queryFn: () => {
      return fetchData<Assessment[] | []>(
        `${URL}/api/web/teachers/${teacherId}/assessments`,
        "Failed to fetch assessments",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// get single assessment
export const useTeacherAssessment = (
  teacherId: string,
  assessmentId: string,
) => {
  return useQuery<Assessment>({
    queryKey: ["teacher", teacherId, "assessments", assessmentId],
    queryFn: () =>
      fetchData<Assessment>(
        `${URL}/api/web/teachers/${teacherId}/assessments/${assessmentId}`,
        "Failed to fetch assessment",
      ),
    enabled: !!teacherId && !!assessmentId,
    staleTime: DATA_STALE_TIME,
  });
};
