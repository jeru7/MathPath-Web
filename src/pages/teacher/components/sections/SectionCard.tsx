import { type ReactElement } from "react"

import luffy1 from "../../../../assets/images/luffyBanner.jpg"
import luffy2 from "../../../../assets/images/luffyBnWBanner.jpg"
import luffy3 from "../../../../assets/images/luffyGear4Banner.jpg"

import { Ellipsis } from "lucide-react"
import { format } from 'date-fns'

import { SectionType } from "../../../../types/section"

export default function SectionCard({ section }: { section: SectionType }): ReactElement {
  return (
    <section className={`flex max-w-lg flex-col rounded-md bg-white opacity-90 shadow-md hover:cursor-pointer hover:opacity-100`}>
      <div className={`bg-[var(--${section.color})] h-1 w-full rounded-t-3xl`}></div>
      <div className="flex flex-col gap-4 p-4">
        {/* Banner */}
        <div className="rounded-sm">
          <img
            src={section.banner === "SBanner_1"
              ? luffy1
              : section.banner === "SBanner_2"
                ? luffy2
                : luffy3}
            alt="section banner"
            className="w-height w-full object-contain" />
        </div>
        {/* Header */}
        <header className="flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{section.name}</h3>
            <Ellipsis className="h-8 w-12 hover:scale-105 hover:cursor-pointer" />
          </div>
          <p className="text-xs text-[var(--primary-gray)]">{`Last checked on ${format(new Date(section.lastChecked), 'MMMM d, yyyy')}`}</p>
        </header>
        {/* Section details - Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <p className="text-4xl font-bold">{section.students?.length ?? 0}</p>
            <p className="text-[var(--primary-gray)]">Students</p>
          </div>
          <div className="flex items-end gap-1">
            <p className="text-4xl font-bold">{section.assessments?.length ?? 0}</p>
            <p className="text-[var(--primary-gray)]">Assessments</p>
          </div>
        </div>
        {/* Section details - Bottom */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p>Online</p>
            <p>0</p>
          </div>
          {/* Online Bar */}
          <div className="relative h-3 rounded-full">
            <div className="absolute left-0 top-0 h-full w-full rounded-full opacity-50"
              style={{ backgroundColor: `var(--${section.color})` }}>
            </div>
            <div className={`bg-[var(--${section.color})] h-full w-[0%] rounded-full`}></div>
          </div>
          <p className="text-right text-xs text-[var(--primary-gray)]">{`Created on ${format(new Date(section.createdAt), "MMMM d, yyyy")}`}</p>
        </div>
      </div>
    </section >
  )
}
