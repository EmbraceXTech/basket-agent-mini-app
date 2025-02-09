import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL || "https://basket-api.satosheep.com",
});

export default axiosInstance;
