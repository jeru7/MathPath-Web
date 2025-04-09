import { useContext } from "react";
import { TeacherContext } from "../context/TeacherContext";

export const useTeacherData = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error(
      "useTeacherData must be used within a TeacherDataProvider.",
    );
  }

  return context;
};
