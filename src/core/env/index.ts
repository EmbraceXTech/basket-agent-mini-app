const env = {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  VITE_PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID || "",
};

export default env;
