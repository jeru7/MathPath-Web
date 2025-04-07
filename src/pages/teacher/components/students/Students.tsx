import { useState, useEffect, useRef, type ReactElement } from "react";
import { useParams } from "react-router-dom";

import PrimaryStat, { IPrimaryStatProps } from "./PrimaryStat";

export default function Students(): ReactElement {
  const { teacherId } = useParams();
  const [stats, setStats] = useState({
    totalStudents: 0,
    onlineStudents: 0,
    averageLevel: 0,
  });

  const primaryStats: IPrimaryStatProps[] = [
    {
      color: "bg-[var(--primary-green)]",
      title: "Total Students",
      totalStudents: stats.totalStudents
    },
    {
      color: "bg-[var(--primary-orange)]",
      title: "Online Students",
      onlineStudents: stats.onlineStudents,
    },
    {
      color: "bg-[var(--secondary-orange)]",
      title: "Average Level",
      averageLevel: stats.averageLevel,
    }
  ]
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        console.log("Opening WebSocket...");
        wsRef.current = new WebSocket("ws://localhost:3001");

        wsRef.current.onopen = () => {
          console.log("WebSocket connected.");
          wsRef.current?.send(
            JSON.stringify({
              type: "TEACHER_CHECK_STUDENTS",
              data: teacherId,
            }),
          );
        };

        wsRef.current.onclose = () => {
          console.log("WebSocket closed.");
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        wsRef.current.onmessage = (event) => {
          console.log("Message received!");
          const { type, data } = JSON.parse(event.data);
          if (type === "TEACHER_STUDENTS_DATA") {
            setStats(() => ({
              totalStudents: data.students.length,
              onlineStudents: data.onlineStudents.length,
              averageLevel: data.averageLevel,
            }));
          }
        };
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket...");
        wsRef.current.close();
      }
    };
  }, [teacherId]);

  return (
    <main className="flex h-full w-full flex-col gap-4 bg-inherit p-4">
      {/* Header */}
      <div className="flex w-full items-center justify-between">
        <h3 className="text-4xl font-bold">Students</h3>
        <button className="hover:scale-101 rounded-md bg-[var(--primary-green)] px-8 py-4 shadow-sm hover:cursor-pointer">
          <p className="text-[var(--primary-white)]">Add Student</p>
        </button>
      </div>
      {/* Students overall stats */}
      <div className="flex w-full gap-2">
        {primaryStats.map((stat, index) => (
          <PrimaryStat
            key={index}
            title={stat.title}
            color={stat.color}
            totalStudents={stat.totalStudents}
            onlineStudents={stat.onlineStudents}
            averageLevel={stat.averageLevel}
          />
        ))}
      </div>
    </main>
  );
}
