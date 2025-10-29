import { type ReactElement, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import {
  Section,
  SectionBanner,
} from "../../../core/types/section/section.type";
import ModalOverlay from "../../../core/components/modal/ModalOverlay";
import {
  EditSectionDTO,
  EditSectionSchema,
} from "../../../core/types/section/section.schema";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import { ZodError } from "zod";

type EditSectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null;
  onUpdateSection: (sectionId: string, data: EditSectionDTO) => Promise<void>;
  isSubmitting: boolean;
};

export default function EditSectionModal({
  isOpen,
  onClose,
  section,
  onUpdateSection,
  isSubmitting,
}: EditSectionModalProps): ReactElement {
  const [formData, setFormData] = useState<EditSectionDTO>({
    name: "",
    color: "primary-green",
    banner: "SBanner_1",
  });
  const [errors, setErrors] = useState<{
    [key in keyof EditSectionDTO]?: string;
  }>({});

  useEffect(() => {
    if (section) {
      setFormData({
        name: section.name || "",
        color: section.color || "primary-green",
        banner: section.banner || "SBanner_1",
      });
    }
    setErrors({});
  }, [section]);

  const handleInputChange = (field: keyof EditSectionDTO, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      EditSectionSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: { [key in keyof EditSectionDTO]?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof EditSectionDTO] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !section) return;

    try {
      await onUpdateSection(section.id, formData);
      onClose();
    } catch (error) {
      // error handling is done in the parent component
      console.error("Failed to update section:", error);
    }
  };

  const colorOptions = [
    {
      value: "primary-green" as const,
      label: "Green",
      color: "bg-[var(--primary-green)]",
    },
    {
      value: "tertiary-green" as const,
      label: "Teal",
      color: "bg-[var(--tertiary-green)]",
    },
    {
      value: "primary-orange" as const,
      label: "Orange",
      color: "bg-[var(--primary-orange)]",
    },
    {
      value: "primary-yellow" as const,
      label: "Yellow",
      color: "bg-[var(--primary-yellow)]",
    },
  ];

  const bannerOptions: SectionBanner[] = [
    "SBanner_1",
    "SBanner_2",
    "SBanner_3",
  ];

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <article className="relative h-[100vh] w-[100vw] p-4 shadow-sm md:h-fit md:max-h-[90vh] md:w-[80vw] md:overflow-x-hidden lg:w-[60vw] lg:max-w-4xl rounded-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200 flex flex-col">
        <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
          {/* header */}
          <header className="flex items-center justify-between border-b border-b-gray-200 dark:border-b-gray-700 pb-4 transition-colors duration-200">
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg md:text-xl">
              Edit Section
            </h3>
            <button
              className="hover:scale-105 hover:cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 p-1"
              type="button"
              onClick={onClose}
            >
              <FaTimes className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          </header>

          {/* form content */}
          <div className="flex-1 py-4">
            <div className="flex flex-col gap-4 md:gap-2 px-4">
              {/* section name */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sectionName"
                    className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base"
                  >
                    Section Name
                  </label>
                  {errors.name && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  name="sectionName"
                  placeholder="Enter section name"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 md:p-2 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 text-sm md:text-base h-12 md:h-10"
                  disabled={isSubmitting}
                />
              </div>

              {/* color selection */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base">
                    Section Color
                  </label>
                  {errors.color && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.color}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange("color", option.value)}
                      className={`flex items-center gap-3 p-3 border rounded-lg transition-all duration-200 ${formData.color === option.value
                          ? "border-green-500 dark:border-green-400 ring-1 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isSubmitting}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${option.color} border border-gray-300 dark:border-gray-600`}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* banner selection */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 text-sm md:text-base">
                    Section Banner
                  </label>
                  {errors.banner && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.banner}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bannerOptions.map((banner) => (
                    <button
                      key={banner}
                      type="button"
                      onClick={() => handleInputChange("banner", banner)}
                      className={`p-3 border rounded-lg transition-all duration-200 ${formData.banner === banner
                          ? "border-green-500 dark:border-green-400 ring-1 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={isSubmitting}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={getSectionBanner(banner)}
                          alt={`Banner ${banner}`}
                          className="w-full h-20 object-cover rounded-md"
                        />
                        <span
                          className={`text-xs font-medium ${formData.banner === banner
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-400"
                            }`}
                        >
                          Banner {banner.split("_")[1]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 px-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[var(--primary-green)] hover:bg-[var(--primary-green)]/90 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </article>
    </ModalOverlay>
  );
}
