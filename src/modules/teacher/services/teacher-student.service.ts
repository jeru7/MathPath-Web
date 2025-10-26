import { useMutation, useQuery } from "@tanstack/react-query";
import { Student } from "../../student/types/student.type";
import { deleteData, fetchData, postData } from "../../core/utils/api/api.util";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import { TeacherStudentActivity } from "../../core/types/activity/activity.type";
import { AddStudentDTO } from "../../student/types/student.schema";

// teacher add student
export const useTeacherAddStudent = (teacherId: string) => {
  return useMutation({
    mutationFn: (newStudent: AddStudentDTO) => {
      return postData<Student, AddStudentDTO>(
        `${BASE_URI}/api/web/teachers/${teacherId}/students`,
        newStudent,
        "Failed to add new student.",
      );
    },
  });
};

// teacher get students
export const useTeacherStudents = (teacherId: string) => {
  return useQuery<Student[] | []>({
    queryKey: ["teacher", teacherId, "students"],
    queryFn: () => {
      return fetchData<Student[] | []>(
        `${BASE_URI}/api/web/teachers/${teacherId}/students`,
        "Failed to fetch student.",
      );
    },
    staleTime: DATA_STALE_TIME,
    enabled: !!teacherId,
  });
};

// teacher delete student
export const useTeacherDeleteStudent = (teacherId: string) => {
  return useMutation({
    mutationFn: (studentId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/teachers/${teacherId}/students/${studentId}`,
        "Failed to delete student.",
      );
    },
  });
};

// teacher get student activities
export const useTeacherStudentActivities = (teacherId: string) => {
  return useQuery<TeacherStudentActivity[]>({
    queryKey: ["teacher", teacherId, "student-activities"],
    queryFn: () =>
      fetchData<TeacherStudentActivity[]>(
        `${BASE_URI}/api/web/teachers/${teacherId}/student-activities`,
        "Failed to fetch student activities.",
      ),
    enabled: !!teacherId,
    staleTime: DATA_STALE_TIME,
  });
};
