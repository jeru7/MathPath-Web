import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/api/error.util";

const RATE_LIMIT_TOAST_ID = "rate-limit-toast";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      const errorData = handleApiError(err);
      if (errorData.error === "RATE_LIMIT_EXCEEDED") {
        toast.warn(errorData.message || "Too many requests", {
          position: "top-center",
          toastId: RATE_LIMIT_TOAST_ID,
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      const errorData = handleApiError(err);
      if (errorData.error === "RATE_LIMIT_EXCEEDED") {
        toast.warn(errorData.message || "Too many requests", {
          position: "top-center",
          toastId: RATE_LIMIT_TOAST_ID,
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
