export interface BackendError {
  success: boolean;
  message: string;
  error: string;
  meta?: {
    statusCode: number;
    errorCode?: string;
    details: unknown;
  };
}
