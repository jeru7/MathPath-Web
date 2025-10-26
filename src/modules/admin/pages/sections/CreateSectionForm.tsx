import { type ReactElement, useMemo, useState } from "react";
import * as sectionType from "../../../core/types/section/section.type";
import {
  CreateSectionDTO,
  CreateSectionSchema,
  SectionBannerEnum,
  SectionColorEnum,
} from "../../../core/types/section/section.schema";
import { IoClose } from "react-icons/io5";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminContext } from "../../context/admin.context";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { handleApiError } from "../../../core/utils/api/error.util";
import { useAdminCreateSection } from "../../services/admin-section.service";
import Select from "react-select";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import { FaTimes } from "react-icons/fa";
import FormButtons from "../../../core/components/buttons/FormButtons";

type TeacherOption = {
  value: string;
  label: string;
  email: string;
  verified: boolean;
};

type CreateSectionFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateSectionForm({
  isOpen,
  onClose,
}: CreateSectionFormProps): ReactElement {
  const { teachers, adminId } = useAdminContext();
  const { mutate: createSection } = useAdminCreateSection(adminId);
  const queryClient = useQueryClient();
  const [unverifiedTeacherError, setUnverifiedTeacherError] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CreateSectionDTO>({
    resolver: zodResolver(CreateSectionSchema),
    defaultValues: {
      name: "",
      color: "primary-green",
      banner: "SBanner_1",
      teacherIds: [],
    },
  });

  const selectedBanner = watch("banner");
  const selectedColor = watch("color");

  // format teachers for react select
  const teacherOptions = useMemo((): TeacherOption[] => {
    return teachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.lastName}, ${teacher.firstName} ${teacher.middleName ? teacher.middleName.charAt(0) + "." : ""
        }`.trim(),
      email: teacher.email,
      verified: teacher.verified.verified,
    }));
  }, [teachers]);

  const handleClose = () => {
    reset();
    setUnverifiedTeacherError(null);
    onClose();
  };

  const onSubmit = async (data: CreateSectionDTO) => {
    createSection(data, {
      onSuccess: () => {
        toast.success("Section created successfully.");
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "sections"],
        });
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        reset();
        setUnverifiedTeacherError(null);
        onClose();
      },
      onError: (err: unknown) => {
        const errorData = handleApiError(err);

        if (errorData.error === "SECTION_NAME_TAKEN") {
          setError("name", {
            type: "manual",
            message: "Section name already exists.",
          });
        } else if (errorData.error === "UNVERIFIED_TEACHER") {
          setUnverifiedTeacherError(
            "One or more selected teachers are not verified. Please remove unverified teachers or ask them to complete verification.",
          );
        } else {
          toast.error("Failed to create section.");
        }
      },
    });
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose}>
      <div className="rounded-md h-[90vh] w-[95vw] md:w-[500px] md:h-[80vh] lg:w-[600px] xl:w-[700px] bg-white dark:bg-gray-800 p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200 overflow-hidden">
        <form
          className="flex flex-col justify-between gap-4 h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 overflow-y-auto flex-1">
            <header className="flex items-center justify-between border-b-2 border-gray-200 dark:border-gray-700 pb-4 transition-colors duration-200">
              <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                Create Section
              </h2>
              <button
                type="button"
                className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                onClick={handleClose}
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
                  Section Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  placeholder="Enter section name"
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
                  <div className="flex gap-4 pb-2">
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

              {/* teacher assignment */}
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                  Teachers
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select teachers who will manage this section
                </p>

                <Controller
                  name="teacherIds"
                  control={control}
                  render={({ field }) => (
                    <Select<TeacherOption, true>
                      isMulti
                      options={teacherOptions}
                      value={teacherOptions.filter((option) =>
                        field.value.includes(option.value),
                      )}
                      onChange={(selectedOptions) => {
                        const selectedValues = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        field.onChange(selectedValues);
                        // clear unverified teacher error
                        if (unverifiedTeacherError) {
                          setUnverifiedTeacherError(null);
                        }
                      }}
                      isOptionDisabled={(option) => !option.verified}
                      styles={getCustomSelectColor({
                        minHeight: "44px",
                        padding: "0px 4px",
                        backgroundColor: "white",
                        textColor: "#1f2937",
                        optionHoverColor: "#f3f4f6",
                        optionSelectedColor: "#10b981",
                        border: true,
                        borderColor: "#d1d5db",
                        borderFocusColor: "#10b981",
                        menuBackgroundColor: "white",
                        menuWidth: "100%",
                        dark: {
                          backgroundColor: "#374151",
                          textColor: "#f9fafb",
                          optionHoverColor: "#4b5563",
                          borderColor: "#4b5563",
                          borderFocusColor: "#10b981",
                          menuBackgroundColor: "#374151",
                          placeholderColor: "#9ca3af",
                        },
                      })}
                      placeholder="Search and select teachers..."
                      className="react-select-container"
                      classNamePrefix="react-select"
                      formatOptionLabel={(option: TeacherOption) => (
                        <div
                          className={`flex items-center justify-between w-full ${!option.verified
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                            }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900 dark:text-gray-200 font-semibold">
                              {option.label}
                            </span>
                            <span
                              className={`text-xs ${!option.verified
                                  ? "text-gray-500 dark:text-gray-900"
                                  : "text-gray-600 dark:text-gray-300"
                                }`}
                            >
                              {option.email}
                            </span>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${option.verified
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                              }`}
                          >
                            {option.verified ? "Verified" : "Unverified"}
                          </div>
                        </div>
                      )}
                      components={{
                        Option: ({ children, ...props }) => (
                          <div
                            {...props.innerProps}
                            className={`
                              px-3 py-2 cursor-pointer transition-colors duration-200
                              ${props.isDisabled
                                ? "bg-gray-50 text-gray-400 dark:bg-gray-600 dark:text-gray-900 cursor-not-allowed"
                                : props.isFocused
                                  ? "bg-gray-100 dark:bg-gray-700"
                                  : "bg-white dark:bg-gray-800"
                              }
                              ${props.isSelected
                                ? "bg-green-50 dark:bg-green-900"
                                : ""
                              }
                            `}
                          >
                            {children}
                          </div>
                        ),
                        MultiValueContainer: (props) => (
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-100">
                            {props.children}
                          </div>
                        ),
                        MultiValueLabel: (props) => (
                          <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <span className="text-sm">{props.data.label}</span>
                            <div
                              className={`w-2 h-2 rounded-full ${props.data.verified
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                                }`}
                            />
                          </div>
                        ),
                        MultiValueRemove: (props) => {
                          const handleClick = (
                            e: React.MouseEvent<HTMLDivElement>,
                          ) => {
                            e.stopPropagation(); // prevent event bubbling
                            // call the original onclick handler
                            props.innerProps.onClick?.(e);
                          };

                          return (
                            <div
                              {...props.innerProps}
                              className="hover:bg-red-100 dark:hover:bg-red-900 rounded-sm p-1 transition-colors duration-200 cursor-pointer"
                              onClick={handleClick}
                            >
                              <FaTimes className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
                            </div>
                          );
                        },
                      }}
                    />
                  )}
                />
                {errors.teacherIds && (
                  <p className="text-sm text-red-500 dark:text-red-400 transition-colors duration-200">
                    {errors.teacherIds.message}
                  </p>
                )}
                {unverifiedTeacherError && (
                  <p className="text-sm text-red-500 dark:text-red-400 transition-colors duration-200">
                    {unverifiedTeacherError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <FormButtons
              handleBack={handleClose}
              text={isSubmitting ? "Creating..." : "Create Section"}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}
