export type SuccessReponse = {
  success: boolean;
  data: unknown | null;
  message: string;
  meta?: {
    statusCode: number;
    errorCode?: string;
    details: unknown;
  };
};

export type ErrorResponse = {
  success: boolean;
  error: string;
  message: string;
  data: unknown | null;
  meta?: {
    statusCode: number;
    errorCode?: string;
    details: unknown;
  };
};
