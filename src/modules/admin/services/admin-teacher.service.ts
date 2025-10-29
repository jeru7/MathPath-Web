import { useMutation } from "@tanstack/react-query";
import { deleteData, patchData, postData } from "../../core/utils/api/api.util";
import { BASE_URI } from "../../core/constants/api.constant";
import {
  AddTeacherDTO,
  EditTeacherDTO,
} from "../../teacher/types/teacher.schema";
import { Teacher } from "../../teacher/types/teacher.type";

export const useAdminAddTeacher = (adminId: string) => {
  return useMutation({
    mutationFn: (teacherData: AddTeacherDTO) => {
      return postData<Teacher, AddTeacherDTO>(
        `${BASE_URI}/api/web/admins/${adminId}/teachers`,
        teacherData,
        "Failed to add new teacher.",
      );
    },
  });
};

export const useAdminEditTeacher = (adminId: string) => {
  return useMutation({
    mutationFn: ({
      teacherId,
      teacherData,
    }: {
      teacherId: string;
      teacherData: EditTeacherDTO;
    }) => {
      return patchData<Teacher, EditTeacherDTO>(
        `${BASE_URI}/api/web/admins/${adminId}/teachers/${teacherId}`,
        teacherData,
        "Failed to update teacher.",
      );
    },
  });
};

export const useAdminDeleteTeacher = (adminId: string) => {
  return useMutation({
    mutationFn: (teacherId: string) => {
      return deleteData<null>(
        `${BASE_URI}/api/web/admins/${adminId}/teachers/${teacherId}`,
        "Failed to delete teacher.",
      );
    },
  });
};
