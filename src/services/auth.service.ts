import axiosInstance from "@/core/axios";

const checkAT = async (_accessToken?: string) => {
  const accessToken = _accessToken ?? localStorage.getItem("accessToken");
  if (!accessToken) {
    return false;
  }

  try {
    const response = await axiosInstance.get(`/auth/check-at-valid`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const authApi = {
  checkAT,
};

export default authApi;
