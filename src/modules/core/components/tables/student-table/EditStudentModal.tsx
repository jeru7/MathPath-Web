import { type ReactElement, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  EditStudentDTO,
  EditStudentSchema,
} from "../../../../student/types/student.schema";
import { APIErrorResponse } from "../../../../core/types/api/api.type";
import { handleApiError } from "../../../../core/utils/api/error.util";
import { Gender } from "../../../../core/types/user.type";
import { Student } from "../../../../student/types/student.type";
import { Section } from "../../../../core/types/section/section.type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditStudentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onUpdateStudent: (studentId: string, data: EditStudentDTO) => Promise<void>;
  isSubmitting?: boolean;
  sections: Section[];
  showSectionSelection: boolean;
};

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
  isSubmitting = false,
  sections,
  showSectionSelection,
}: EditStudentModalProps): ReactElement {
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditStudentDTO>({
    resolver: zodResolver(EditStudentSchema),
    defaultValues: {
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      middleName: student?.middleName || "",
      gender: (student?.gender as Gender) || null,
      email: student?.email || "",
      sectionId: student?.sectionId || "",
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName || "",
        gender: student.gender as Gender,
        email: student.email,
        sectionId: student.sectionId,
      });
    }
  }, [student, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: EditStudentDTO) => {
    if (!student) return;

    try {
      await onUpdateStudent(student.id, data);
      reset(data);
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const errorData: APIErrorResponse = handleApiError(err);

        switch (errorData.error) {
          case "EMAIL_ALREADY_EXISTS":
            setError("email", {
              type: "manual",
              message: errorData.message || "Email already exists",
            });
            break;

          default:
            toast.error("Failed to update student");
        }
      } else {
        toast.error("Failed to update student");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* first name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name
                {errors.firstName && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.firstName.message}
                  </span>
                )}
              </Label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="Enter first name"
              />
            </div>

            {/* last name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name
                {errors.lastName && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.lastName.message}
                  </span>
                )}
              </Label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Enter last name"
              />
            </div>

            {/* middle name */}
            <div className="space-y-2">
              <Label htmlFor="middleName">
                Middle Name
                <span className="text-muted-foreground text-xs ml-1">
                  (Optional)
                </span>
                {errors.middleName && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.middleName.message}
                  </span>
                )}
              </Label>
              <Input
                id="middleName"
                {...register("middleName")}
                placeholder="Enter middle name"
              />
            </div>

            {/* gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender
                {errors.gender && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.gender.message}
                  </span>
                )}
              </Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">
                Email
                {errors.email && (
                  <span className="text-destructive text-xs ml-2">
                    {errors.email.message}
                  </span>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email"
              />
            </div>

            {/* section */}
            {showSectionSelection && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="section">
                  Section
                  {errors.sectionId && (
                    <span className="text-destructive text-xs ml-2">
                      {errors.sectionId.message}
                    </span>
                  )}
                </Label>
                <Controller
                  name="sectionId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
