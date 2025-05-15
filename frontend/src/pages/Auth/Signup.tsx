import { useState } from "react";
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
  inviteToken: yup.string().required("Invite token is required"),
});

export default function SignupForm() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

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

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const onSubmit = (data: any) => {
    console.log("Signup data:", data);
    // Add your signup logic here
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
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-dashed border-gray-300 bg-gray-100">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    <Upload size={24} />
                  </AvatarFallback>
                )}
              </Avatar>
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
            <label htmlFor="avatar-upload" className="cursor-pointer mt-2">
              <div className="text-sm font-medium text-indigo-600 hover:underline">
                {avatarPreview ? "Change avatar" : "Upload avatar"}
              </div>
              <input
                id="avatar-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarUpload}
              />
            </label>
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
