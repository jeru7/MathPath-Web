import { useState, type ReactElement } from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { FilterOption, teacherActivityFilter } from "../../types/select.type";
import { getCustomSelectColor } from "../../styles/selectStyles";
// import StudentActivity from "./StudentActivity";
import StudentActivity from "./StudentActivity";
import TeacherActivity from "../../../teacher/pages/dashboard/components/activity_list/TeacherActivity";

interface IActivityListProps {
  classes?: string;
  type: "Student" | "Teacher";
}

export default function ActivityList({
  classes,
  type,
}: IActivityListProps): ReactElement {
  const [selectedFilter, setSelectedFilter] = useState(
    teacherActivityFilter[0],
  );
  const customStyles: StylesConfig<FilterOption> =
    getCustomSelectColor<FilterOption>({
      minHeight: "24px",
      border: false,
    });

  return (
    <article
      className={`${classes} py-2 px-3 flex flex-col h-full bg-white rounded-md gap-2 shadow-xs`}
    >
      <header className="w-full flex items-center justify-between border-b-gray-300 border-b-1 pb-1">
        <p className="font-semibold">Recent Activity</p>
        <Select
          options={teacherActivityFilter}
          value={selectedFilter}
          onChange={(option: SingleValue<FilterOption>) => {
            if (option) setSelectedFilter(option);
          }}
          isMulti={false}
          styles={customStyles}
          className="text-xs w-28"
          isSearchable={false}
          menuPlacement="auto"
        />{" "}
      </header>

      <div
        className="h-full overflow-scroll pr-4 min-h-[400px]"
        style={{
          maxHeight: `${type === "Teacher" ? "475px" : "350px"}`,
        }}
      >
        <div className="relative flex flex-col w-full h-fit">
          {/* Vertical Line */}
          <div
            className="absolute left-2 top-0 w-1 rounded-full bg-[var(--secondary-green)]"
            style={{ height: "calc(100% - 2rem)" }}
          ></div>

          {/* Activity List */}
          <section className="flex-col flex pl-8 h-fit">
            <TeacherActivity />
            <StudentActivity />
          </section>
        </div>
      </div>
      {/* TODO: view all placing - initial sizing of the container above */}
      <p className="ml-auto text-sm underline text-gray-400 hover:cursor-pointer hover:text-gray-500 transition-colors duration-200">
        View all
      </p>
    </article>
  );
}
