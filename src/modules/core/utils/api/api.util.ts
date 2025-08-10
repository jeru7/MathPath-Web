import axios from "axios";

// helper for react query

// for useQuery
export const fetchData = async <TResponse>(
  url: string,
  errorMessage: string,
): Promise<TResponse> => {
  try {
    const res = await axios.get<{ data: TResponse }>(url);
    return res.data.data;
  } catch {
    throw new Error(errorMessage);
  }
};

// for useMutation
export const postData = async <TResponse, TRequest>(
  url: string,
  body: TRequest,
  errorMessage: string,
): Promise<TResponse> => {
  try {
    const res = await axios.post<{ data: TResponse }>(url, body);
    return res.data.data;
  } catch {
    throw new Error(errorMessage);
  }
};

export const patchData = async <TResponse, TRequest>(
  url: string,
  body: TRequest,
  errorMessage: string,
): Promise<TResponse> => {
  try {
    const res = await axios.patch<{ data: TResponse }>(url, body);
    return res.data.data;
  } catch {
    throw new Error(errorMessage);
  }
};

export const deleteData = async <TResponse>(
  url: string,
  errorMessage: string,
): Promise<TResponse | null> => {
  try {
    const res = await axios.delete<{ data: TResponse }>(url);
    return res.data.data ?? null;
  } catch {
    throw new Error(errorMessage);
  }
};
