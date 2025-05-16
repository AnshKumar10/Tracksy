import { useContext, useRef, useState } from "react";
import * as yup from "yup";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AuthLayout from "@/components/layouts/AuthLayout";
import type { UserInterface } from "@/lib/types/user";
import axiosInstance from "@/lib/axios";
import { API_PATHS } from "@/lib/apiPaths";
import { UserContext } from "@/context/UserContext";
import { UserRoles } from "@/lib/enums";
import { useNavigate } from "react-router-dom";
import { handleApiError, imageUploadHandler } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const signupSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  inviteToken: yup.string().optional(),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

export default function SignupForm() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const userContext = useContext(UserContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      inviteToken: "",
    },
  });

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const removeAvatar = () => setAvatarPreview(null);

  const onSubmit = async (values: SignupFormValues) => {
    let profileImage: string | null = null;

    try {
      if (avatarPreview) {
        // TODO : Fix this image not uploading issue
        const response = await imageUploadHandler(avatarPreview);
        profileImage = response;
      }

      const response = await axiosInstance.post<UserInterface>(
        API_PATHS.AUTH.REGISTER,
        {
          name: values?.fullName,
          email: values?.email,
          password: values?.password,
          adminInviteToken: values?.inviteToken,
          profileImage,
        }
      );

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("access_token", token);
        userContext?.updateUser(response.data);
        if (role === UserRoles.ADMIN) navigate("/admin/dashboard");
        else if (role === UserRoles.MEMBER) navigate("/user/dashboard");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 mt-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Fill in the information below to get started
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Upload */}
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <button
                type="button"
                onClick={handleAvatarClick}
                className="focus:outline-none"
              >
                <Avatar className="w-20 h-20 border-2 border-dashed border-gray-300 bg-gray-100 hover:opacity-90">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} />
                  ) : (
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      <Upload size={24} />
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={removeAvatar}
                >
                  <X size={12} />
                </Button>
              )}
            </div>
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer mt-2 text-sm font-medium text-indigo-600 hover:underline"
              onClick={handleAvatarClick}
            >
              {avatarPreview ? "Change avatar" : "Upload avatar"}
            </Label>
            <input
              ref={fileInputRef}
              id="avatar-upload"
              name="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          {/* Fields */}
          {[
            { name: "fullName", label: "Full Name" },
            { name: "email", label: "Email Address" },
            { name: "password", label: "Password" },
            { name: "confirmPassword", label: "Confirm Password" },
            { name: "inviteToken", label: "Invite Token" },
          ].map(({ name, label }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={
                          name.includes("password")
                            ? showPassword[
                                name as "password" | "confirmPassword"
                              ]
                              ? "text"
                              : "password"
                            : "text"
                        }
                        className="py-5 pr-10"
                        {...field}
                      />
                      {name.includes("password") && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              [name]: !prev[name as keyof typeof prev],
                            }))
                          }
                        >
                          {showPassword[name as keyof typeof showPassword] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="w-full py-5 text-base font-semibold">
            Create Account
          </Button>

          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Log in
            </a>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
