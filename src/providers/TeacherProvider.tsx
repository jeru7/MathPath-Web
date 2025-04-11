import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { TeacherContext } from "../context/TeacherContext";
import {
  useTeacher,
  useTeacherAssessments,
  useTeacherOnlineStudents,
  useTeacherSections,
  useTeacherStudents
} from "../hooks/useTeacherData";

import { TeacherType } from "../types/teacher"; import { StudentType } from "../types/student";
import { SectionType } from "../types/section";
import { AssessmentType } from "../types/assessment";

export function TeacherProvider({
  teacherId,
  children }:
  {
    teacherId: string,
    children: React.ReactNode
  }) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  const { data: teacher } = useTeacher(teacherId);
  const { data: students } = useTeacherStudents(teacherId);
  const { data: sections } = useTeacherSections(teacherId);
  const { data: assessments } = useTeacherAssessments(teacherId);
  const { data: onlineStudents } = useTeacherOnlineStudents(teacherId);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        wsRef.current = new WebSocket("ws://localhost:3001");

        wsRef.current.onopen = () => {
          wsRef.current?.send(JSON.stringify({
            type: "TEACHER_INITIAL",
            data: teacherId,
          }))
        }
      };

      wsRef.current.onmessage = (e) => {
        const { type, data } = JSON.parse(e.data);
        // console.log("Received message: ", type, data)

        if (type === "TEACHER_INITIAL_DATA") {
          queryClient.setQueryData<TeacherType>(
            ["teacher", teacherId],
            data.teacher
          )

          queryClient.setQueryData<StudentType[]>(
            ["teacher", teacherId, "students"],
            data.students
          )

          queryClient.setQueryData<SectionType[]>(
            ["teacher", teacherId, 'sections'],
            data.sections
          )

          queryClient.setQueryData<AssessmentType[]>(
            ["teacher", teacherId, "assessments"],
            data.assessments
          );

          queryClient.setQueryData<StudentType[]>(
            ["teacher", teacherId, "onlineStudents"],
            data.onlineStudents
          )
        }

        if (type === "STUDENT_ONLINE_UPDATE") {
          queryClient.setQueryData<StudentType[]>(
            ["teacher", teacherId, "onlineStudents"],
            data.onlineStudents
          )
        }
      }
    }

    connectWebSocket();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current?.close();
    }

  }, [teacherId, queryClient]);

  const value = {
    teacher: teacher || null,
    students: students || [],
    sections: sections || [],
    assessments: assessments || [],
    onlineStudents: onlineStudents || [],
  }

  return (
    <TeacherContext.Provider value={value}>
      {teacher && students && sections && assessments ? (
        children
      ) : <div>Loading teacher data...</div>}
    </TeacherContext.Provider>
  );
}

