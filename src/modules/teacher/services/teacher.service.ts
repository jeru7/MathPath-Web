import { Assessment } from "../../core/types/assessment/assessment.type";
import { Section } from "../../core/types/section/section.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteData, fetchData, postData } from "../../core/utils/api/api.util";
import { DATA_STALE_TIME, URL } from "../../core/constants/api.constant";
import { Student } from "../../student/types/student.type";
import { Teacher } from "../types/teacher.type";
import { TeacherStudentActivity } from "../../core/types/activity/activity.type";
import { RegistrationCode } from "../../core/types/registration-code/registration-code.type";
import { CreateSectionDTO } from "../../core/types/section/section.schema";

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

export const useTeacherDeleteStudent = (teacherId: string) => {
  return useMutation({
    mutationFn: (studentId: string) => {
      return deleteData<null>(
        `${URL}/api/web/teachers/${teacherId}/students/${studentId}`,
        "Failed to delete student.",
      );
    },
  });
};

export const useTeacherStudentActivities = (teacherId: string) => {
  return useQuery<TeacherStudentActivity[]>({
    queryKey: ["teacher", teacherId, "student-activities"],
    queryFn: () =>
      fetchData<TeacherStudentActivity[]>(
        `${URL}/api/web/teachers/${teacherId}/student-activities`,
        "Failed to fetch student activities.",
      ),
    enabled: !!teacherId,
    staleTime: DATA_STALE_TIME,
  });
};

export const useTeacherGenerateCode = (teacherId: string) => {
  return useMutation({
    mutationFn: (variables: {
      sectionId: string | null;
      maxUses: number;
      forceReplace: boolean;
    }) => {
      return postData<RegistrationCode, typeof variables>(
        `${URL}/api/web/teachers/${teacherId}/registration-code`,
        variables,
        "Failed to generate registration code.",
      );
    },
  });
};

export const useTeacherRegistrationCodes = (teacherId: string) => {
  return useQuery<RegistrationCode[]>({
    queryKey: ["teacher", teacherId, "registration-codes"],
    queryFn: () =>
      fetchData<RegistrationCode[]>(
        `${URL}/api/web/teachers/${teacherId}/registration-code`,
        "Failed to fetch registration codes.",
      ),
    enabled: !!teacherId,
  });
};

export const useTeacherDeleteRegistrationCode = (teacherId: string) => {
  return useMutation({
    mutationFn: (codeId: string) => {
      return deleteData<null>(
        `${URL}/api/web/teachers/${teacherId}/registration-code/${codeId}`,
        "Failed to delete registration code.",
      );
    },
  });
};

export const useTeacherCreateSection = (teacherId: string) => {
  return useMutation({
    mutationFn: (sectionData: CreateSectionDTO) => {
      return postData<Section, CreateSectionDTO>(
        `${URL}/api/web/teachers/${teacherId}/sections`,
        sectionData,
        "Failed to create a new section.",
      );
    },
  });
};

export const useTeacherDeleteSection = (teacherId: string) => {
  return useMutation({
    mutationFn: (sectionId: string) => {
      return deleteData<null>(
        `${URL}/api/web/teachers/${teacherId}/sections/${sectionId}`,
        "Failed to create a new section.",
      );
    },
  });
};
