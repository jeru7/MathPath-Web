import { type ReactElement } from "react";
import "../../../../../core/styles/customTable.css";
import { useParams } from "react-router-dom";
import AttemptHistoryItem from "./AttemptHistoryItem";
import { StageAttempt } from "../../../../../core/types/stage-attempt/stage-attempt.type";
import { useStudentAttempts } from "../../../../../student/services/student.service";

export default function AttemptHistory(): ReactElement {
  const { studentId } = useParams();
  const { data: studentAttempts } = useStudentAttempts(studentId || "");

  const attempts = studentAttempts ?? [];

  return (
    <article className="flex flex-col h-full">
      <header className="p-4 font-bold">
        <h3 className="text-xl xl:text-2xl">Attempt History</h3>
      </header>

      {attempts.length === 0 ? (
        <div className="h-full flex items-center justify-center italic text-[var(--primary-gray)] w-full">
          Student has no attempts
        </div>
      ) : (
        <div className="h-full table-container">
          <div className="min-h-full">
            <table className="font-primary table-auto">
              <thead className="text-[var(--primary-gray)]">
                <tr className="text-center">
                  <th className="">Stage</th>
                  <th className="">Topic</th>
                  <th className="">Date Taken</th>
                  <th className="">Answer Correctness</th>
                  <th className="">Result</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt: StageAttempt) => (
                  <AttemptHistoryItem attempt={attempt} key={attempt.id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </article>
  );
}
