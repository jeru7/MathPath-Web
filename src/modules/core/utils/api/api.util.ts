import axios from "axios";

// allows withCredentials globally, para makapag send ng cookies
axios.defaults.withCredentials = true;

// for useQuery
export const fetchData = async <TResponse>(
  url: string,
  errorMessage: string,
): Promise<TResponse> => {
  try {
    const res = await axios.get<{ data: TResponse }>(url);
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) throw err;
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
  } catch (err) {
    if (axios.isAxiosError(err)) throw err;
    throw new Error(errorMessage);
  }
};

// for PATCH
export const patchData = async <TResponse, TRequest>(
  url: string,
  body: TRequest,
  errorMessage: string,
): Promise<TResponse> => {
  try {
    const res = await axios.patch<{ data: TResponse }>(url, body);
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) throw err;
    throw new Error(errorMessage);
  }
};

// for DELETE
export const deleteData = async <TResponse>(
  url: string,
  errorMessage: string,
): Promise<TResponse | null> => {
  try {
    const res = await axios.delete<{ data: TResponse }>(url);
    return res.data.data ?? null;
  } catch (err) {
    if (axios.isAxiosError(err)) throw err;
    throw new Error(errorMessage);
  }
};
