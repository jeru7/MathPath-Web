import { useMutation, useQuery } from "@tanstack/react-query";
import { Student } from "../../student/types/student.type";
import { BASE_URI, DATA_STALE_TIME } from "../../core/constants/api.constant";
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from "../../core/utils/api/api.util";
import {
  AddStudentDTO,
  EditStudentDTO,
} from "../../student/types/student.schema";

export const useAdminAddStudent = (adminId: string) => {
  return useMutation({
    mutationFn: (newStudent: AddStudentDTO) => {
      return postData<Student, AddStudentDTO>(
        `${BASE_URI}/api/web/admins/${adminId}/students`,
        newStudent,
        "Failed to add new student.",
      );
    },
  });
};

export const useAdminStudents = (adminId: string) => {
  return useQuery<Student[]>({
    queryKey: ["admin", adminId, "students"],
    queryFn: () =>
      fetchData<Student[]>(
        `${BASE_URI}/api/web/admins/${adminId}/students`,
        "Failed to fetch students.",
      ),
    staleTime: DATA_STALE_TIME,
    enabled: !!adminId,
  });
};

export const useAdminDeleteStudent = (adminId: string) => {
  return useMutation({
    mutationFn: (studentId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/admins/${adminId}/students/${studentId}`,
        "Failed to delete student.",
      );
    },
  });
};

export const useAdminEditStudent = (adminId: string) => {
  return useMutation({
    mutationFn: ({
      studentId,
      studentData,
    }: {
      studentId: string;
      studentData: EditStudentDTO;
    }) => {
      return patchData<Student, EditStudentDTO>(
        `${BASE_URI}/api/web/admins/${adminId}/students/${studentId}`,
        studentData,
        "Failed to edit student.",
      );
    },
  });
};
