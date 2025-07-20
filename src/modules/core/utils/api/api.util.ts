import axios from "axios";

export const fetchData = async <T>(
  url: string,
  errorMessage: string,
): Promise<T> => {
  try {
    const res = await axios.get<{ data: T }>(url);
    console.log(res);
    if (res.data?.data === undefined) {
      throw new Error("No data field found in response");
    }

    return res.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(errorMessage);
  }
};
