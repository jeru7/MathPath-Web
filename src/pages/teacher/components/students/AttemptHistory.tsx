import { type ReactElement } from "react";
import "../../../../styles/customTable.css";
import { useStudentAttempts } from "../../../../hooks/useStudent";
import { useParams } from "react-router-dom";
import AttemptHistoryItem from "./AttemptHistoryItem";

export default function AttemptHistory(): ReactElement {
  const { studentId } = useParams();
  const { data: studentAttempts } = useStudentAttempts(studentId || "");

  const attempts = studentAttempts ?? [];

  return attempts.length === 0 ? (
    <div className="h-full flex items-center justify-center italic text-[var(--primary-gray)] w-full">
      Student has no attempts
    </div>
  ) : (
    <div className="h-full table-container">
      <div className="min-h-full">
        <table className="font-primary table-auto">
          <thead className="text-[var(--primary-gray)]">
            <tr className="text-center">
              <th className="">Game Level</th>
              <th className="">Topic</th>
              <th className="">Date Taken</th>
              <th className="">Answer Correctness</th>
              <th className="">Result</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <AttemptHistoryItem attempt={attempt} key={attempt.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
