import { type ReactElement } from "react";
import { Section } from "../../../../../core/types/section/section.type";
import { getSectionBanner } from "../../../../../core/utils/section/section.util";
import { IoClose } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SectionItemProps = {
  data: Section;
  onDelete: (section: Section) => void;
  studentCount?: number;
};

export default function SectionItem({
  data,
  onDelete,
}: SectionItemProps): ReactElement {
  return (
    <Card className="group transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={getSectionBanner(data.banner)}
              alt="section banner"
              className="w-12 h-12 rounded-md object-cover border"
            />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm">{data.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(data)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
          >
            <IoClose className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
