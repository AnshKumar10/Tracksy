import { isAxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

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
