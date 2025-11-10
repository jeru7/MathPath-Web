import { type ReactElement, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Section,
  SectionBanner,
} from "../../../../core/types/section/section.type";
import {
  EditSectionDTO,
  EditSectionSchema,
  SectionBannerEnum,
  SectionColorEnum,
} from "../../../../core/types/section/section.schema";
import { getSectionBanner } from "../../../../core/utils/section/section.util";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditSectionDTO>({
    resolver: zodResolver(EditSectionSchema),
    defaultValues: {
      name: "",
      color: "primary-green",
      banner: "SBanner_1",
    },
  });

  const selectedBanner = watch("banner");
  const selectedColor = watch("color");

  useEffect(() => {
    if (section) {
      reset({
        name: section.name || "",
        color: section.color || "primary-green",
        banner: section.banner || "SBanner_1",
      });
    }
  }, [section, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EditSectionDTO) => {
    if (!section) return;

    try {
      await onUpdateSection(section.id, data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* section name */}
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
              disabled={isSubmitting}
            />
          </div>

          {/* banner selection */}
          <div className="space-y-3">
            <Label>
              Select Banner
              {errors.banner && (
                <span className="text-destructive text-xs ml-2">
                  {errors.banner.message}
                </span>
              )}
            </Label>
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
                        src={getSectionBanner(banner as SectionBanner)}
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
            <Label>
              Select Color
              {errors.color && (
                <span className="text-destructive text-xs ml-2">
                  {errors.color.message}
                </span>
              )}
            </Label>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
