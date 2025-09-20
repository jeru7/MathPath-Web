import { type ReactElement } from "react";
import * as sectionType from "../../../../core/types/section/section.type";
import {
  CreateSectionDTO,
  CreateSectionSchema,
  SectionBannerEnum,
  SectionColorEnum,
} from "../../../../core/types/section/section.schema";
import { IoClose } from "react-icons/io5";
import { getSectionBanner } from "../../../../core/utils/section/section.util";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeacherContext } from "../../../context/teacher.context";
import { useTeacherCreateSection } from "../../../services/teacher.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { handleApiError } from "../../../../core/utils/api/error.util";

export default function CreateSectionForm({
  onCloseForm,
}: {
  onCloseForm: () => void;
}): ReactElement {
  const { teacherId } = useTeacherContext();
  const { mutate: createSection } = useTeacherCreateSection(teacherId ?? "");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<CreateSectionDTO>({
    resolver: zodResolver(CreateSectionSchema),
    defaultValues: {
      name: "",
      teacherId: teacherId,
      color: "primary-green",
      banner: "SBanner_1",
    },
  });

  const selectedBanner = watch("banner");
  const selectedColor = watch("color");

  const onSubmit = async (data: CreateSectionDTO) => {
    createSection(data, {
      onSuccess: () => {
        toast.success("Section created successfully.");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "sections"],
        });
        onCloseForm();
      },
      onError: (err: unknown) => {
        const errorData = handleApiError(err);

        if (errorData.error === "SECTION_NAME_TAKEN") {
          setError("name", {
            type: "manual",
            message: "Section name already exists.",
          });
        } else {
          toast.error("Failed to create section.");
        }
      },
    });
  };

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/20">
      <div className="rounded-md h-[100vh] w-[100vw] md:w-2xl md:h-fit bg-[var(--primary-white)] p-4">
        <form
          className="flex flex-col justify-between gap-4 h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between border-b-[var(--primary-gray)]/50 border-b-2 pb-4">
              <h2 className="">Add Section</h2>
              <button
                type="button"
                className="hover:scale-105 hover:cursor-pointer"
                onClick={onCloseForm}
              >
                <IoClose />
              </button>
            </header>

            <div className="flex w-full flex-col gap-4">
              {/* name input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className={`font-semibold`}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`border-1 rounded-lg bg-inherit p-2 focus:border-[var(--primary-green)] focus:outline-none`}
                  placeholder="Enter name here"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* banner selection */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Select Banner</label>
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-4">
                    {SectionBannerEnum.options.map((banner) => (
                      <label
                        key={banner}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="radio"
                          value={banner}
                          {...register("banner")}
                          className="hidden"
                        />
                        <div
                          className={`border-1 h-20 w-32 rounded-lg hover:scale-105 ${
                            selectedBanner === banner
                              ? "border-4 border-[var(--primary-green)]"
                              : ""
                          }`}
                        >
                          <img
                            src={getSectionBanner(
                              banner as sectionType.SectionBanner,
                            )}
                            alt="section banner"
                            className="h-full w-full rounded-sm object-cover"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* color selection */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Select Color</label>
                <div className="flex gap-4">
                  {SectionColorEnum.options.map((color) => (
                    <label
                      key={color}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        value={color}
                        {...register("color")}
                        className="hidden"
                      />
                      <span
                        className={`bg-[var(--${color})] border-1 h-10 w-10 rounded-sm hover:scale-105 ${
                          selectedColor === color ? "border-3" : ""
                        }`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex w-full justify-between">
            <button
              type="button"
              className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-colors duration-200"
              onClick={onCloseForm}
            >
              <p className="underline">Cancel</p>
            </button>
            <button
              type="submit"
              className="rounded-sm bg-[var(--primary-green)] px-5 py-2 text-white opacity-80 hover:opacity-100 hover:cursor-pointer transition-opacity duration-200"
            >
              Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
