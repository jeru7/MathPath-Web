import { isAxiosError } from "axios";
import { useEffect, useState, type ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "../../../utils/api/error.util";
import { verifyEmailService } from "../../../../auth/services/auth.service";

type Status = "loading" | "success" | "error";
type ErrorType =
  | "USER_NOT_FOUND"
  | "ALREADY_VERIFIED"
  | "INVALID_TOKEN"
  | "UNKNOWN";

export default function VerifyEmailPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [errorType, setErrorType] = useState<ErrorType>("UNKNOWN");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setErrorType("INVALID_TOKEN");
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyEmailService(email, token);
        setStatus("success");
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const errorData = handleApiError(error);

          switch (errorData.error) {
            case "USER_NOT_FOUND":
            case "ALREADY_VERIFIED":
            case "INVALID_TOKEN":
              setErrorType(errorData.error);
              break;
            default:
              setErrorType("UNKNOWN");
          }
        } else {
          setErrorType("UNKNOWN");
        }
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const renderErrorMessage = () => {
    switch (errorType) {
      case "USER_NOT_FOUND":
        return "No account found with this email.";
      case "ALREADY_VERIFIED":
        return "Your email is already verified.";
      case "INVALID_TOKEN":
        return "This verification link is invalid or expired.";
      case "UNKNOWN":
      default:
        return "Something went wrong. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <>
          <h2 className="text-2xl font-bold">Email Verified!</h2>
          <p>You can now log in to your account.</p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => navigate("/auth/login")}
          >
            Go to Login
          </button>
        </>
      )}
      {status === "error" && (
        <>
          <h2 className="text-2xl font-bold text-red-600">
            Verification Failed
          </h2>
          <p>{renderErrorMessage()}</p>
        </>
      )}
    </div>
  );
}
