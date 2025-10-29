import { type ReactElement } from "react";
import { FaCircleCheck, FaFile } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../../../contexts/student.context";
import { useStudentAssessments } from "../../../services/student-assessment.service";

export default function Todo(): ReactElement {
  const navigate = useNavigate();
  const { studentId, student } = useStudentContext();
  const { data: assessments = [] } = useStudentAssessments(studentId);

  const assessmentsDue = assessments.filter((assessment) => {
    if (assessment.status !== "published") return false;

    // check if current date is within assessment date range
    const now = new Date();
    const startDate = assessment.date.start
      ? new Date(assessment.date.start)
      : null;
    const endDate = assessment.date.end ? new Date(assessment.date.end) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    // find student's attempt data for this assessment
    const studentAssessment = student?.assessments?.find(
      (sa) => sa.assessmentId === assessment.id,
    );

    // check if student hasn't reached attempt limit
    const attemptsCount = studentAssessment?.attempts?.length || 0;
    return attemptsCount < assessment.attemptLimit;
  }).length;

  const hasAssessmentsDue = assessmentsDue > 0;

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("assessments");
  };

  return (
    <article className="w-full h-full rounded-sm shadow-sm p-3 bg-white border border-white dark:border-gray-700 dark:bg-gray-800 flex flex-col gap-1 transition-colors duration-200">
      <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
        To-do
      </p>
      <div className="w-full h-full flex items-center justify-start">
        <div className="flex gap-2 items-center justify-center">
          {hasAssessmentsDue ? (
            <>
              <FaFile className="text-[var(--primary-green)]" />
              <p
                className="hover:text-[var(--primary-green)] text-sm hover:cursor-pointer transition-colors duration-200 dark:text-gray-300"
                onClick={handleTextClick}
              >
                {assessmentsDue} Assessment
                {assessmentsDue !== 1 ? "s" : ""} due
              </p>
            </>
          ) : (
            <>
              <FaCircleCheck className="text-green-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No assessments due
              </p>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
