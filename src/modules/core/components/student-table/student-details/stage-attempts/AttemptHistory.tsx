import { type ReactElement } from "react";
import { IoGameController } from "react-icons/io5";
import AttemptHistoryItem from "./AttemptHistoryItem";
import { Student } from "../../../../../student/types/student.type";
import { useStudentAttempts } from "../../../../../student/services/student.service";
import { StageAttempt } from "../../../../types/stage-attempt/stage-attempt.type";

type AttemptHistoryProps = {
  student: Student;
};

export default function AttemptHistory({
  student,
}: AttemptHistoryProps): ReactElement {
  const { data: studentAttempts, isLoading } = useStudentAttempts(student.id);

  const attempts = studentAttempts ?? [];

  if (isLoading) {
    return (
      <div className="bg-inherit rounded-sm">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <IoGameController className="w-5 h-5" />
          Stage Attempts
        </h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-400 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading stage attempts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-inherit rounded-sm">
      <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <IoGameController className="w-5 h-5" />
        Stage Attempts ({attempts.length})
      </h3>

      {attempts.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center py-8 text-gray-500 dark:text-gray-400">
          <IoGameController className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No stage attempts found</p>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="h-64 overflow-y-auto">
              <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Date Taken</th>
                    <th className="px-4 py-3 font-medium text-center">
                      Correctness
                    </th>
                    <th className="px-4 py-3 font-medium text-center">
                      Time Spent
                    </th>
                    <th className="px-4 py-3 font-medium text-center">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {attempts.map((attempt: StageAttempt) => (
                    <AttemptHistoryItem attempt={attempt} key={attempt.id} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
