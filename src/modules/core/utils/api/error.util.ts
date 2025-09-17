import axios from "axios";
import { APIErrorResponse } from "../../types/api/api.type";

export function handleApiError(error: unknown): APIErrorResponse {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as APIErrorResponse | undefined;

    if (response && response.error) {
      return response;
    }

    return {
      success: false,
      error: "AXIOS_ERROR",
      message: error.message || "Request failed",
      data: null,
      meta: {
        statusCode: error.response?.status ?? 500,
        details: error.toJSON?.() ?? error,
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: "CLIENT_ERROR",
      message: error.message,
      data: null,
      meta: { statusCode: 500, details: error.stack },
    };
  }

  return {
    success: false,
    error: "UNKNOWN_ERROR",
    message: "Something went wrong.",
    data: null,
  };
}
