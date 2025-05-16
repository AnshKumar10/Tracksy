import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import axiosInstance from "./axios";
import { API_PATHS } from "./apiPaths";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleApiError = (
  error: unknown,
  fallbackMessage = "An error occurred. Please try again."
) => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (message) {
      toast.error(message);
      return;
    }
  }

  // Fallback error
  toast.error(fallbackMessage);
};

export const imageUploadHandler = async (file: string) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axiosInstance.post(
      API_PATHS.USER.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
