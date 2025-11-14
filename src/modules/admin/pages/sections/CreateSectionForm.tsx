import { type ReactElement, useMemo, useState } from "react";
import * as sectionType from "../../../core/types/section/section.type";
import {
  CreateSectionDTO,
  CreateSectionSchema,
  SectionBannerEnum,
  SectionColorEnum,
} from "../../../core/types/section/section.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminContext } from "../../context/admin.context";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { handleApiError } from "../../../core/utils/api/error.util";
import { useAdminCreateSection } from "../../services/admin-section.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSectionBanner } from "../../../core/utils/section/section.util";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateSectionFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

// color mapping to tailwind classes
const colorClassMap = {
  "primary-green": "bg-green-500",
  "tertiary-green": "bg-emerald-400",
  "primary-orange": "bg-orange-500",
  "primary-yellow": "bg-yellow-400",
};

export default function CreateSectionForm({
  isOpen,
  onClose,
}: CreateSectionFormProps): ReactElement {
  const { rawTeachers, adminId } = useAdminContext();
  const { mutate: createSection, isPending: isSubmitting } =
    useAdminCreateSection(adminId);
  const queryClient = useQueryClient();
  const [unverifiedTeacherError, setUnverifiedTeacherError] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
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
  const selectedTeacherIds = watch("teacherIds");

  const teacherOptions = useMemo(() => {
    return rawTeachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.lastName}, ${teacher.firstName} ${teacher.middleName ? teacher.middleName.charAt(0) + "." : ""
        }`.trim(),
      verified: teacher.verified.verified,
    }));
  }, [rawTeachers]);

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

  const handleTeacherSelect = (teacherId: string) => {
    const currentTeachers = selectedTeacherIds || [];
    if (!currentTeachers.includes(teacherId)) {
      const updatedTeachers = [...currentTeachers, teacherId];
      setValue("teacherIds", updatedTeachers);
      if (unverifiedTeacherError) {
        setUnverifiedTeacherError(null);
      }
    }
  };

  const removeTeacher = (teacherId: string) => {
    const currentTeachers = selectedTeacherIds || [];
    const updatedTeachers = currentTeachers.filter((id) => id !== teacherId);
    setValue("teacherIds", updatedTeachers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create Section
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* name input */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Section Name
              {errors.name && (
                <span className="text-destructive text-xs ml-2">
                  {errors.name.message}
                </span>
              )}
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter section name"
            />
          </div>

          {/* banner selection */}
          <div className="space-y-3">
            <Label>Select Banner</Label>
            <div className="overflow-x-auto">
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
                          ? "border-4 border-primary shadow-md"
                          : "border-border"
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
          <div className="space-y-3">
            <Label>Select Color</Label>
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
                    className={`${colorClassMap[color]} border-2 h-10 w-10 rounded-sm hover:scale-105 transition-transform duration-200 ${selectedColor === color
                        ? "border-3 border-foreground shadow-md"
                        : "border-border"
                      }`}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* teacher assignment */}
          <div className="space-y-3">
            <Label>
              Teachers
              {errors.teacherIds && (
                <span className="text-destructive text-xs ml-2">
                  {errors.teacherIds.message}
                </span>
              )}
            </Label>
            <p className="text-sm text-muted-foreground">
              Select teachers who will manage this section
            </p>

            <Select onValueChange={handleTeacherSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Search and select teachers..." />
              </SelectTrigger>
              <SelectContent>
                {teacherOptions.map((teacher) => (
                  <SelectItem
                    key={teacher.value}
                    value={teacher.value}
                    disabled={!teacher.verified}
                    className="flex items-center"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1">{teacher.label}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded flex-shrink-0 ml-2 ${teacher.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {teacher.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* selected teachers */}
            {selectedTeacherIds && selectedTeacherIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTeacherIds.map((teacherId) => {
                  const teacher = teacherOptions.find(
                    (t) => t.value === teacherId,
                  );
                  if (!teacher) return null;

                  return (
                    <div
                      key={teacherId}
                      className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{teacher.label}</span>
                      <button
                        type="button"
                        onClick={() => removeTeacher(teacherId)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {unverifiedTeacherError && (
              <p className="text-sm text-destructive">
                {unverifiedTeacherError}
              </p>
            )}
          </div>

          {/* action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Section"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
