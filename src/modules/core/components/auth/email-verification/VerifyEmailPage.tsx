import { isAxiosError } from "axios";
import { useEffect, useState, type ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "../../../utils/api/error.util";
import { verifyEmailService } from "../../../../auth/services/auth.service";

export default function VerifyEmailPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await verifyEmailService(email, token);
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const errorData = handleApiError(error);
          switch (errorData.error) {
            case "USER_NOT_FOUND":
            case "ALREADY_VERIFIED":
            case "INVALID_TOKEN":
          }
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

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
          <p>Invalid or expired verification link.</p>
        </>
      )}
    </div>
  );
}
