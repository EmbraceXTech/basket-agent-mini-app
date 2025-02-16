import axios from "axios";

import env from "../env";
import localStorageUtil from "@/utils/localStorage.util";

const axiosInstance = axios.create({
  baseURL: env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
  },
});

export default axiosInstance;
