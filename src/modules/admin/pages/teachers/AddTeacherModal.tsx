import { useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  AddTeacherDTO,
  AddTeacherSchema,
} from "../../../teacher/types/teacher.schema";
import { APIErrorResponse } from "../../../core/types/api/api.type";
import { handleApiError } from "../../../core/utils/api/error.util";
import { Gender } from "../../../core/types/user.type";
import { getCustomSelectColor } from "../../../core/styles/selectStyles";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminContext } from "../../../admin/context/admin.context";
import { useAdminAddTeacher } from "../../../admin/services/admin-teacher.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTeacherModal({
  isOpen,
  onClose,
}: AddTeacherModalProps): ReactElement {
  const { adminId } = useAdminContext();
  const { mutate: addTeacher, isPending: isSubmitting } =
    useAdminAddTeacher(adminId);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<AddTeacherDTO>({
    resolver: zodResolver(AddTeacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      gender: null,
      email: "",
      password: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: AddTeacherDTO) => {
    addTeacher(data, {
      onSuccess: () => {
        toast.success("Teacher added successfully");
        // invalidate and refresh the teacher data
        queryClient.invalidateQueries({
          queryKey: ["admin", adminId, "teachers"],
        });
        handleClose();
      },
      onError: (err: unknown) => {
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
              toast.error("Failed to add teacher");
          }
        }
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[100dvw] h-[100dvh] max-w-none lg:max-w-[625px] lg:h-fit overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Teacher
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="space-y-6 flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* first name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  {errors.firstName && (
                    <p className="text-xs text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter first name"
                  className="h-10"
                />
              </div>

              {/* last name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  {errors.lastName && (
                    <p className="text-xs text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter last name"
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* middle name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Label htmlFor="middleName" className="text-sm font-medium">
                    Middle Name
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      (Optional)
                    </span>
                  </Label>
                  {errors.middleName && (
                    <span className="text-xs text-destructive">
                      {errors.middleName.message}
                    </span>
                  )}
                </div>
                <Input
                  id="middleName"
                  {...register("middleName")}
                  placeholder="Enter middle name"
                  className="h-10"
                />
              </div>

              {/* gender */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender
                  </Label>
                  {errors.gender && (
                    <span className="text-xs text-destructive">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select<{ value: Gender; label: string }>
                      {...field}
                      id="gender"
                      name="gender"
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                      getOptionLabel={(option) => option.label}
                      getOptionValue={(option) => option.value}
                      styles={getCustomSelectColor<{
                        value: Gender;
                        label: string;
                      }>({
                        height: "40px",
                        minHeight: "40px",
                        padding: "0px 8px",
                        menuWidth: "100%",
                        menuBackgroundColor: "hsl(var(--background))",
                        backgroundColor: "hsl(var(--background))",
                        textColor: "hsl(var(--foreground))",
                        dark: {
                          backgroundColor: "hsl(var(--muted))",
                          textColor: "hsl(var(--foreground))",
                          borderColor: "hsl(var(--border))",
                          borderFocusColor: "hsl(var(--primary))",
                          optionHoverColor: "hsl(var(--accent))",
                          optionSelectedColor: "hsl(var(--primary))",
                          menuBackgroundColor: "hsl(var(--background))",
                          placeholderColor: "hsl(var(--muted-foreground))",
                        },
                      })}
                      className="basic-select"
                      classNamePrefix="select"
                      placeholder="Select gender"
                      onChange={(selected) => field.onChange(selected?.value)}
                      value={
                        field.value
                          ? {
                            value: field.value,
                            label: field.value === "Male" ? "Male" : "Female",
                          }
                          : null
                      }
                    />
                  )}
                />
              </div>
            </div>

            {/* email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="h-10"
              />
            </div>

            {/* password */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  maxLength={32}
                  placeholder="Enter password"
                  className="h-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaRegEye className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FaRegEyeSlash className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-auto border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? "Creating..." : "Add Teacher"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
