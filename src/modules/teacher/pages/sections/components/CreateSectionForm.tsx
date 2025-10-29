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
import ModalOverlay from "../../../../core/components/modal/ModalOverlay";
import FormButtons from "../../../../core/components/buttons/FormButtons";

type CreateSectionFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateSectionForm({
  isOpen,
  onClose,
}: CreateSectionFormProps): ReactElement {
  const { teacherId } = useTeacherContext();
  const { mutate: createSection, isPending: isSubmitting } =
    useTeacherCreateSection(teacherId);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
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

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateSectionDTO) => {
    createSection(data, {
      onSuccess: () => {
        toast.success("Section created successfully.");
        queryClient.invalidateQueries({
          queryKey: ["teacher", teacherId, "sections"],
        });
        reset();
        onClose();
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
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <article className="relative h-[100vh] w-[100vw] p-4 shadow-sm md:h-fit md:max-h-[90vh] md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] lg:max-w-4xl overflow-y-auto rounded-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex flex-col">
        <form
          className="flex flex-col flex-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <header className="flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 pb-4 transition-colors duration-200">
            <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-lg md:text-xl">
              Create Section
            </h2>
            <button
              type="button"
              className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 p-1"
              onClick={handleClose}
            >
              <IoClose className="w-6 h-6 md:w-5 md:h-5" />
            </button>
          </header>

          {/* form content */}
          <div className="flex-1 py-4">
            <div className="flex flex-col gap-4 md:gap-2">
              {/* name input */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="name"
                    className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
                  >
                    Section Name
                  </label>
                  {errors.name && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10"
                  placeholder="Enter section name"
                />
              </div>

              {/* banner selection */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base">
                    Select Banner
                  </label>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex gap-4 pb-2 min-w-max">
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base">
                    Select Color
                  </label>
                </div>
                <div className="flex gap-4 flex-wrap">
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

          {/* action buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <FormButtons
              handleBack={handleClose}
              text={isSubmitting ? "Creating..." : "Create Section"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </article>
    </ModalOverlay>
  );
}
