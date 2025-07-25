import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SBanner_1 from "../../../../../assets/images/section-banners/Banner_1.jpg";
import SBanner_2 from "../../../../../assets/images/section-banners/Banner_2.jpg";
import SBanner_3 from "../../../../../assets/images/section-banners/Banner_3.jpg";

import * as sectionType from "../../../../core/types/section/section.type";
import { createSection } from "../../../../core/services/section/section.service";
import { CreateSectionDTO } from "../../../../core/types/section/section.schema";

export default function CreateSectionForm({
  setShowForm,
}: {
  setShowForm: (show: boolean) => void;
}): ReactElement {
  const { teacherId } = useParams();
  const queryClient = useQueryClient();

  const [sectionData, setSectionData] = useState<CreateSectionDTO>({
    name: "",
    teacherId: teacherId as string,
    color: "primary-green",
    banner: "SBanner_1",
    lastChecked: new Date().toString(),
    studentIds: [] as string[],
    assessmentIds: [] as string[],
  });
  const [showError, setShowError] = useState(false);

  const addSectionMutation = useMutation({
    mutationFn: (sectionData: CreateSectionDTO) =>
      createSection(teacherId as string, sectionData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher", teacherId, "sections"],
      });
      handleCancel();
    },
    onError: (error) => {
      console.error("Error in adding section.", error);
    },
  });

  useEffect(() => {
    if (teacherId) {
      setSectionData((prev) => ({
        ...prev,
        teacher: teacherId,
      }));
    }
  }, [teacherId]);

  const handleNameInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (value.length >= 40) return;
    setSectionData((prev) => ({
      ...prev,
      name: value,
    }));
    if (showError) setShowError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionData.name?.trim()) {
      setSectionData((prev) => ({
        ...prev,
        name: "",
      }));
      setShowError(true);
      return;
    }

    addSectionMutation.mutate(sectionData);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (!teacherId) return <div>Loading...</div>;

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/20">
      <form onSubmit={handleSubmit}>
        <div className="w-2xl flex max-w-2xl flex-col gap-8 rounded-md bg-[var(--primary-white)] p-8">
          <div className="border-b-[var(--primary-gray)]/50 border-b-2 pb-2">
            <h2 className="text-2xl font-bold">Add Section</h2>
          </div>
          <div className="flex w-full flex-col gap-8">
            {/* Name input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className={`text-xl font-semibold ${showError && "text-red-400"}`}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={sectionData.name}
                onChange={handleNameInputChange}
                className={`border-1 rounded-lg bg-inherit p-2 focus:border-[var(--primary-green)] focus:outline-none`}
                placeholder="Enter name here"
              />
            </div>
            {/* Banner Selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="color" className="text-xl font-semibold">
                Select Banner
              </label>
              <div className="flex gap-4">
                {["SBanner_1", "SBanner_2", "SBanner_3"].map((banner) => (
                  <label
                    key={banner}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="color"
                      value={banner}
                      checked={sectionData.banner === banner}
                      onChange={() =>
                        setSectionData((prev) => ({
                          ...prev,
                          banner: banner as sectionType.SectionBanner,
                        }))
                      }
                      className="hidden"
                    />
                    <div
                      className={`border-1 h-20 w-32 rounded-lg hover:scale-105 ${sectionData.banner === banner ? "border-4 border-[var(--primary-green)]" : ""}`}
                    >
                      <img
                        src={
                          banner === "SBanner_1"
                            ? SBanner_1
                            : banner === "SBanner_2"
                              ? SBanner_2
                              : SBanner_3
                        }
                        alt="section banner"
                        className="h-full w-full rounded-sm object-cover"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
            {/* Color Selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="color" className="text-xl font-semibold">
                Select Color
              </label>
              <div className="flex gap-4">
                {[
                  "primary-green",
                  "tertiary-green",
                  "primary-orange",
                  "primary-yellow",
                ].map((color) => (
                  <label
                    key={color}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={sectionData.color === color}
                      onChange={() =>
                        setSectionData((prev) => ({
                          ...prev,
                          color: color as sectionType.SectionColor,
                        }))
                      }
                      className="hidden"
                    />
                    <span
                      className={`bg-[var(--${color})] border-1 h-10 w-10 rounded-sm hover:scale-105 ${sectionData.color === color ? "border-3" : ""}`}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end gap-8">
            <button
              className="border-1 rounded-sm px-4 py-1 text-xl hover:scale-105 hover:cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border-1 rounded-sm border-[var(--primary-green)] bg-[var(--primary-green)] px-4 py-1 text-xl text-white hover:scale-105 hover:cursor-pointer"
            >
              Complete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
