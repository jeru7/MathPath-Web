import { useEffect, useRef, useState } from "react";
import { useTeacher } from "../services/teacher.service";
import { WSS } from "../../core/constants/api.constant";
import { TeacherContext } from "./teacher.context";
import {
  useTeacherStudentActivities,
  useTeacherStudents,
} from "../services/teacher-student.service";
import { useTeacherSections } from "../services/teacher-section.service";
import { useTeacherAssessments } from "../services/teacher-assessment.service";
import { useTeacherRequests } from "../services/teacher-request.service";
import PageLoader from "@/components/ui/page-loader";

export function TeacherProvider({
  teacherId,
  children,
}: {
  teacherId: string;
  children: React.ReactNode;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  const { data: teacher, isLoading: isLoadingTeacher } = useTeacher(teacherId);
  const { data: students, isLoading: isLoadingStudents } =
    useTeacherStudents(teacherId);
  const { data: sections, isLoading: isLoadingSections } =
    useTeacherSections(teacherId);
  const { data: assessments, isLoading: isLoadingAssessments } =
    useTeacherAssessments(teacherId);
  const { data: requests, isLoading: isLoadingRequests } =
    useTeacherRequests(teacherId);
  const { data: activities, isLoading: isLoadingActivities } =
    useTeacherStudentActivities(teacherId);

  const [onlineStudentIds, setOnlineStudentIds] = useState<string[]>([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!teacherId) return;

    const ws = new WebSocket(WSS);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "TEACHER_LOGIN", data: teacherId }));
    };

    ws.onmessage = (e) => {
      const { type, data } = JSON.parse(e.data);
      if (type === "TEACHER_INITIAL_DATA")
        setOnlineStudentIds(data.onlineStudents || []);
      if (type === "STUDENT_ONLINE")
        setOnlineStudentIds((prev) => [...prev, data.studentId]);
      if (type === "STUDENT_OFFLINE")
        setOnlineStudentIds((prev) =>
          prev.filter((id) => id !== data.studentId),
        );
    };

    return () => {
      ws.close();
    };
  }, [teacherId]);

  const value = {
    teacherId,
    teacher: teacher || null,
    allStudents: students || [],
    rawStudents: students?.filter((s) => !s.archive.isArchive) || [],
    archivedStudents: students?.filter((s) => s.archive.isArchive) || [],
    allSections: sections || [],
    rawSections: sections?.filter((s) => !s.archive.isArchive) || [],
    archivedSections: sections?.filter((s) => s.archive.isArchive) || [],
    allAssessments: assessments || [],
    rawAssessments: assessments?.filter((a) => !a.archive.isArchive) || [],
    archivedAssessments: assessments?.filter((a) => a.archive.isArchive) || [],
    requests: requests || [],
    activities: activities || [],
    onlineStudents:
      students?.filter((s) => onlineStudentIds.includes(s.id)) || [],

    // loading states
    isLoadingTeacher,
    isLoadingStudents,
    isLoadingSections,
    isLoadingAssessments,
    isLoadingRequests,
    isLoadingActivities,
    isCriticalDataLoaded: !!teacher,
  };

  if (
    showLoader ||
    isLoadingTeacher ||
    isLoadingStudents ||
    isLoadingSections ||
    isLoadingAssessments ||
    isLoadingRequests ||
    isLoadingActivities ||
    !teacher
  ) {
    return <PageLoader items={["Loading teacher data..."]} />;
  }

  return (
    <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
  );
}
