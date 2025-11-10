import { type ReactElement } from "react";
import { useAdminContext } from "../../context/admin.context";
import CustomCalendar from "../../../core/components/calendar/CustomCalendar";
import PrimaryStat, { PrimaryStatProps } from "./PrimaryStat";
import ActivityList from "@/modules/core/components/activity/ActivityList";
import StudentOnlineTrend from "@/modules/teacher/pages/dashboard/components/student_online_trend/StudentOnlineTrend";
import ActiveStudentsCard from "@/modules/teacher/pages/dashboard/components/active_students/ActiveStudentsCard";
import TopicHighlightsCard from "@/modules/teacher/pages/dashboard/components/topic_highlights/TopicHighlightsCard";
import TopStudentsCard from "@/modules/core/components/top-students/TopStudentsCard";

export default function AdminDashboard(): ReactElement {
  const {
    rawStudents,
    teachers,
    rawSections,
    rawAssessments,
    onlineStudents,
    activities,
    adminId,
  } = useAdminContext();

  const primaryStats: PrimaryStatProps[] = [
    {
      color: "bg-green-500 dark:bg-green-600",
      title: "Students",
      students: rawStudents.length,
      onlineStudents: onlineStudents.length,
    },
    {
      color: "bg-blue-500 dark:bg-blue-600",
      title: "Teachers",
      teachers: teachers.length,
      sections: rawSections.length,
    },
    {
      color: "bg-orange-500 dark:bg-orange-600",
      title: "Sections",
      sections: rawSections.length,
    },
    {
      color: "bg-purple-500 dark:bg-purple-600",
      title: "Assessments",
      assessments: rawAssessments.length,
    },
  ];

  return (
    <main className="flex flex-col min-h-screen h-fit w-full gap-2 bg-inherit p-2 mt-4 lg:mt-0">
      <header className="flex items-center justify-between">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Dashboard
        </h3>
      </header>

      <div className="flex-1 flex flex-col xl:flex-row gap-2">
        <div className="xl:w-[80%] flex-1 flex flex-col gap-2">
          <section className="flex min-h-[120px] xl:h-[200px] xl:min-h-[200px] w-full xl:w-full gap-2 overflow-x-auto overflow-y-hidden xl:overflow-x-hidden no-scrollbar">
            {primaryStats.map((stat, index) => (
              <PrimaryStat
                key={index}
                color={stat.color}
                title={stat.title}
                students={stat.students}
                teachers={stat.teachers}
                sections={stat.sections}
                assessments={stat.assessments}
                onlineStudents={stat.onlineStudents}
              />
            ))}
          </section>

          <div className="w-full h-full">
            <StudentOnlineTrend userId={adminId} userType="admin" />
          </div>

          <div className="h-full w-full gap-2 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
            <ActiveStudentsCard userId={adminId} userType="admin" />
            <TopicHighlightsCard userId={adminId} userType="admin" />
            <TopStudentsCard userId={adminId} userType="admin" />
          </div>
        </div>

        <div className="w-full xl:w-[20%] flex flex-col md:flex-row xl:flex-col gap-2">
          <CustomCalendar classes="" />
          <ActivityList type="Admin" activities={activities} />
        </div>
      </div>
    </main>
  );
}
