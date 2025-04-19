export interface ISuccessReponse {
  success: boolean;
  data: unknown | null;
  message: string;
  meta?: {
    statusCode: number;
    errorCode?: string;
    details: unknown;
  };
}

export interface IErrorResponse {
  success: boolean;
  error: string;
  message: string;
  data: unknown | null;
  meta?: {
    statusCode: number;
    errorCode?: string;
    details: unknown;
  };
}
