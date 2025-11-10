import { type ReactElement } from "react";
import * as sectionType from "../../../../core/types/section/section.type";
import {
  CreateSectionDTO,
  CreateSectionSchema,
  SectionBannerEnum,
  SectionColorEnum,
} from "../../../../core/types/section/section.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTeacherContext } from "../../../context/teacher.context";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { handleApiError } from "../../../../core/utils/api/error.util";
import { useTeacherCreateSection } from "../../../services/teacher-section.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSectionBanner } from "@/modules/core/utils/section/section.util";

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
                    className={`bg-[var(--${color})] border-2 h-10 w-10 rounded-sm hover:scale-105 transition-transform duration-200 ${selectedColor === color
                        ? "border-3 border-foreground shadow-md"
                        : "border-border"
                      }`}
                  />
                </label>
              ))}
            </div>
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
