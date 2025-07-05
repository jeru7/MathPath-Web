import { useState, type ReactElement } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import StudentTableItem from "./StudentTableItem";
import { useNavigate } from "react-router-dom";
import "../../../../core/styles/customTable.css";
import { Student } from "../../../../core/types/student/student.types";
import { useTeacherContext } from "../../../hooks/useTeacher";
import { CiFilter, CiSearch } from "react-icons/ci";
import { GoPlus } from "react-icons/go";

const dummyStudent: Student = {
  id: "student-001",
  firstName: "Emmanuel",
  lastName: "Ungab",
  middleName: "D.",
  status: "Online",
  profilePicture: "Boy_1",
  role: "Student",
  referenceNumber: "STU-20240705-001",
  sectionId: "section-abc123",
  characterName: "Valor Knight",
  gender: "Male",
  email: "emmanuel.ungab@example.com",
  assessments: [
    {
      assessmentId: "assess-001",
      score: 95,
      timeSpent: 1800, // in seconds (30 minutes)
      completed: true,
      dateAttempted: "2025-07-04T10:00:00.000Z",
      dateCompleted: "2025-07-04T10:30:00.000Z",
    },
  ],
  username: "emmanuelu",
  character: "Male",
  level: 5,
  exp: {
    currentExp: 1200,
    nextLevelExp: 2000,
  },
  hp: 100,
  quests: [
    {
      questId: "quest-001",
      questReqCompleted: 3,
      isClaimed: false,
    },
  ],
  stages: [
    {
      stageId: "stage-001",
      stage: 1,
      unlocked: true,
      completed: true,
      dateCompleted: "2025-07-01T14:00:00.000Z",
      dateUnlocked: "2025-07-01T09:00:00.000Z",
    },
    {
      stageId: "stage-002",
      stage: 2,
      unlocked: true,
      completed: false,
      dateUnlocked: "2025-07-02T09:00:00.000Z",
    },
  ],
  lastPlayed: "2025-07-05T14:00:00.000Z",
  streak: 3,
  createdAt: "2025-07-01T08:00:00.000Z",
  updatedAt: "2025-07-05T14:00:00.000Z",
};

export default function StudentTable(): ReactElement {
  const { students } = useTeacherContext();
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "ascending" | "descending";
  }>({ key: "status", direction: "descending" });

  const handleSort = (column: keyof Student) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key: column, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    const column = sortConfig.key;
    let comparison = 0;

    if (a[column] instanceof Date && b[column] instanceof Date) {
      const dateA = new Date(a[column]);
      const dateB = new Date(b[column]);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (typeof a[column] === "string" && typeof b[column] === "string") {
      comparison = a[column].localeCompare(b[column]);
    } else if (typeof a[column] === "number" && typeof b[column] === "number") {
      comparison = a[column] - b[column];
    }

    return sortConfig.direction === "ascending" ? comparison : -comparison;
  });

  const handleItemOnclick = (studentId: string) => {
    navigate(`${studentId}`, { replace: true });
  };

  return (
    <section className="h-full">
      <section className="w-full border-b-gray-200 p-4 border-b flex justify-between">
        {/* Search */}
        <section className="flex gap-2 items-center">
          <div className="flex rounded-sm border-gray-200 border h-fit items-center pr-2">
            <div className="p-2">
              <CiSearch className="w-4 h-4 text-gray-400" />
            </div>
            <input
              placeholder="Search student"
              className="text-xs focus:outline-none"
            />
          </div>
          {/* Filter */}
          <button className="p-2 rounded-xs border-gray-200 border text-gray-400 h-fit w-fit hover:cursor-pointer hover:bg-[var(--primary-green)] hover:text-white hover:border-[var(--primary-green)] transition-all duration-200">
            <CiFilter className="w-4 h-4" />
          </button>

          <section className="flex"></section>
        </section>
        {/* Create button */}
        <button
          className="flex gap-2 items-center justify-center py-3 px-4 bg-[var(--primary-green)]/90 rounded-sm text-white hover:cursor-pointer hover:bg-[var(--primary-green)] transition-all duration-200"
          onClick={() => navigate("create")}
        >
          <GoPlus className="w-4 h-4" />
          <p className="text-sm font-semibold">Add Student</p>
        </button>
      </section>

      {/* Table */}
      <div className="h-full">
        <div className="overflow-x-auto">
          {/* Headers */}
          <table className="font-primary table-auto w-full">
            <thead className="text-gray-400">
              <tr className="text-left">
                <th className="w-[15%]">LRN</th>
                <th
                  className="cursor-pointer w-[20%]"
                  onClick={() => handleSort("lastName")}
                >
                  <div
                    className={`flex items-center justify-start gap-2 ${sortConfig.key === "lastName" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Name
                    {sortConfig.key === "lastName" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("sectionId")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "sectionId" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Section
                    {sortConfig.key === "sectionId" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("status")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "status" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Status
                    {sortConfig.key === "status" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("createdAt")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "createdAt" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Date Created
                    {sortConfig.key === "createdAt" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer w-[15%]"
                  onClick={() => handleSort("lastPlayed")}
                >
                  <div
                    className={`flex items-center gap-2 ${sortConfig.key === "lastPlayed" ? "text-[var(--primary-black)]" : ""}`}
                  >
                    Last Played
                    {sortConfig.key === "lastPlayed" ? (
                      sortConfig.direction === "ascending" ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                </th>
                <th className="w-[5%]"></th>
              </tr>
            </thead>
          </table>
        </div>
        {/* student items/list */}
        <div className="h-[750px] overflow-y-auto">
          <table className="font-primary table-auto w-full">
            <tbody>
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
              <StudentTableItem
                student={dummyStudent}
                key={dummyStudent.referenceNumber}
                onClick={handleItemOnclick}
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
