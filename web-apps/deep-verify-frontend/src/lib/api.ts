import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/** Single axios instance. Replaces the five hardcoded backend URLs. */
export const api = axios.create({
  baseURL: `${API_BASE_URL}/backend/v1`,
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-access-token"] = token;
  }
  return config;
});

export function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "The service took too long to respond. Free hosting sleeps when idle - try once more.";
    }
    const detail = error.response?.data?.detail ?? error.response?.data?.message;
    if (typeof detail === "string") return detail;
  }
  return fallback;
}
