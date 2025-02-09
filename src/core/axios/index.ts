import localStorageUtil from "@/utils/localStorage.util";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL || "https://basket-api.satosheep.com",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorageUtil.getItem("accessToken")}`,
  },
});

export default axiosInstance;
