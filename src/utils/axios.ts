import axios, { AxiosHeaders } from "axios";

export const baseAxios = axios.create();
export const authAxios = axios.create();

authAxios.interceptors.request.use(
  (config) => {
    const headers = new AxiosHeaders({
      ...config.headers,
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    });
    return {
      ...config,
      headers,
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);
