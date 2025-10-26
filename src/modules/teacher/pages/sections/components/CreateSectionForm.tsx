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
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { handleApiError } from "../../../../core/utils/api/error.util";
import { useTeacherCreateSection } from "../../../services/teacher-section.service";

export default function CreateSectionForm({
  onCloseForm,
}: {
  onCloseForm: () => void;
}): ReactElement {
  const { teacherId } = useTeacherContext();
  const { mutate: createSection } = useTeacherCreateSection(teacherId);
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
      teacherIds: [teacherId],
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
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/20 dark:bg-black/40">
      <div className="rounded-md h-[100vh] w-[100vw] md:w-2xl md:h-fit bg-white dark:bg-gray-800 p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <form
          className="flex flex-col justify-between gap-4 h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            <header className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 pb-4 transition-colors duration-200">
              <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                Add Section
              </h2>
              <button
                type="button"
                className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                onClick={onCloseForm}
              >
                <IoClose size={24} />
              </button>
            </header>

            <div className="flex w-full flex-col gap-4">
              {/* name input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  placeholder="Enter name here"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-400 transition-colors duration-200">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* banner selection */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  Select Banner
                </label>
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
                          className={`border-2 h-20 w-32 rounded-lg hover:scale-105 transition-transform duration-200 ${selectedBanner === banner
                              ? "border-4 border-green-500 dark:border-green-400 shadow-md"
                              : "border-gray-300 dark:border-gray-600"
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
                <label className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  Select Color
                </label>
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
                        className={`bg-[var(--${color})] border-2 h-10 w-10 rounded-sm hover:scale-105 transition-transform duration-200 ${selectedColor === color
                            ? "border-3 border-gray-900 dark:border-gray-100 shadow-md"
                            : "border-gray-300 dark:border-gray-600"
                          }`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="flex w-full justify-between pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <button
              type="button"
              className="opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              onClick={onCloseForm}
            >
              <p className="underline">Cancel</p>
            </button>
            <button
              type="submit"
              className="rounded-sm bg-green-600 dark:bg-green-500 px-5 py-2 text-white opacity-80 hover:opacity-100 hover:cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
