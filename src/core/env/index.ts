const env = {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  VITE_PARA_APP_ID: import.meta.env.VITE_PARA_APP_ID || "",
};

export default env;
