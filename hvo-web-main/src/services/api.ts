// import { apiEndpoint } from "@/config";
import { API_ENDPOINT } from "@/config-global";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { auth } from "src/firebase";

// const apiEndpoint = "http://localhost:8080/api";

axios.interceptors.request.use(
  async (config) => {
    if (config.url?.startsWith(API_ENDPOINT as string)) {
      if (!config.headers) {
        // @ts-ignore
        config.headers = {
          "Content-Type": "application/json",
        };
      }

      if (!config.headers.authorization) {
        const idToken = await auth.currentUser?.getIdToken();

        if (idToken) {
          config.headers.authorization = `Bearer ${idToken}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const get = async <T = any>(path: string, config?: AxiosRequestConfig<T>): Promise<AxiosResponse<T>> => {
  return await axios.get<T>(`${API_ENDPOINT}/${path}`, config);
};

export const post = async <D = any, R = any>(
  path: string,
  data?: D,
  config?: AxiosRequestConfig<any>
): Promise<AxiosResponse<R>> => {
  return await axios.post(`${API_ENDPOINT}/${path}`, data, config);
};

export const patch = async <T = any>(path: string, data: T) => {
  return await axios.patch<T>(`${API_ENDPOINT}/${path}`, data);
};

export const del = async (path: string, data?: any) => {
  return await axios({ method: "DELETE", data, url: `${API_ENDPOINT}/${path}` });
};
