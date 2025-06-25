import { type ReactElement } from "react";
import { FaRegCircle } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { IoCalendarClear } from "react-icons/io5";

export default function AssessmentStatusCard({
  classes,
}: {
  classes: string;
}): ReactElement {
  return (
    <article
      className={`${classes} bg-white shadow-sm rounded-md p-2 flex flex-col gap-1`}
    >
      <header className="border-b-1 border-b-gray-300 pb-1">
        <p className="font-semibold text-lg">Assessment Status</p>
      </header>

      <div className="h-[200px] overflow-y-auto">
        <section className="flex flex-col gap-1">
          {/* Sample in progress */}
          <article className="flex justify-between border-l-4 border-l-[var(--primary-yellow)] pl-2 rounded-md border-1 border-gray-200 p-2">
            {/* Title and Status */}
            <div className="flex flex-col gap-1">
              <p className="text-md font-semibold">Geometry</p>
              <div className="flex items-center gap-1">
                <FaRegCircle className="text-[var(--primary-yellow)]" />
                <p className="text-xs text-[var(--primary-yellow)]">
                  In Progress
                </p>
              </div>
            </div>
            {/* Date and Sections */}
            <div className="flex flex-col justify-between items-end">
              {/* Date: Start - End */}
              <div className="flex gap-1 text-gray-400">
                <p className="text-[10px] font-semibold">18 APR - 24 APR</p>
                <IoCalendarClear className="" />
              </div>
              {/* Sections */}
              <div className="flex gap-1">
                <div className="border rounded-sm h-5 w-8"></div>
                <div className="border rounded-sm h-5 w-8"></div>
                <div className="border rounded-sm h-5 w-8"></div>
                <div className="border rounded-sm h-5 w-8"></div>
              </div>
            </div>
          </article>
          {/* Sample Completed */}
          <article className="flex justify-between border-l-4 border-l-[var(--primary-green)] pl-2 rounded-md border-1 border-gray-200 p-2">
            {/* Title and Status */}
            <div className="flex flex-col gap-1">
              <p className="text-md font-semibold">Addition</p>
              <div className="flex items-center gap-1">
                <FaCircle className="text-[var(--primary-green)]" />
                <p className="text-xs text-[var(--primary-green)]">Completed</p>
              </div>
            </div>
            {/* Date and Sections */}
            <div className="flex flex-col justify-between items-end">
              {/* Date: Start - End */}
              <div className="flex gap-1 text-gray-400">
                <p className="text-[10px] font-semibold">18 APR - 24 APR</p>
                <IoCalendarClear className="" />
              </div>
              {/* Sections */}
              <div className="flex gap-1">
                <div className="border rounded-sm h-5 w-8"></div>
                <div className="border rounded-sm h-5 w-8"></div>
              </div>
            </div>
          </article>
          {/* Sample Completed */}
          <article className="flex justify-between border-l-4 border-l-[var(--primary-green)] pl-2 rounded-md border-1 border-gray-200 p-2">
            {/* Title and Status */}
            <div className="flex flex-col gap-1">
              <p className="text-md font-semibold">Addition</p>
              <div className="flex items-center gap-1">
                <FaCircle className="text-[var(--primary-green)]" />
                <p className="text-xs text-[var(--primary-green)]">Completed</p>
              </div>
            </div>
            {/* Date and Sections */}
            <div className="flex flex-col justify-between items-end">
              {/* Date: Start - End */}
              <div className="flex gap-1 text-gray-400">
                <p className="text-[10px] font-semibold">18 APR - 24 APR</p>
                <IoCalendarClear className="" />
              </div>
              {/* Sections */}
              <div className="flex gap-1">
                <div className="border rounded-sm h-5 w-8"></div>
                <div className="border rounded-sm h-5 w-8"></div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </article>
  );
}
