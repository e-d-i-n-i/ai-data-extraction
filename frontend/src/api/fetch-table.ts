import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_TABLES_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});
interface FetchDataResult<T> {
  data: T;
  totalPages: number;
  totalItems: number;
}

export const fetchData = async <T>(
  route: string,
  retries = 3
): Promise<FetchDataResult<T>> => {
  try {
    const url = new URL(route, API_URL).toString();
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    return {
      data: response.data as T, // Cast to generic type T
      totalPages: parseInt(response.headers["x-total-pages"] || "1", 10),
      totalItems: parseInt(response.headers["x-total-count"] || "0", 10),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    if (
      axios.isAxiosError(error) &&
      error.code === "ERR_NETWORK" &&
      retries > 0
    ) {
      console.log(`Retrying... (${retries} attempts left)`);
      return fetchData(route, retries - 1);
    }
    throw error;
  }
};
