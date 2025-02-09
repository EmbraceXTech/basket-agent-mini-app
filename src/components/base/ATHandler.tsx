import localStorageUtil from "@/utils/localStorage.util";
import { jwtDecode } from "jwt-decode";

export default function ATHandler({ children }: { children: React.ReactNode }) {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken =
    urlParams.get("accessToken") || localStorageUtil.getItem("accessToken");

  if (!accessToken) {
    return <div>No access token</div>;
  }

  localStorageUtil.setItem("accessToken", accessToken);

  try {
    const decodedToken = jwtDecode(accessToken);
    if (decodedToken?.exp && decodedToken.exp < Date.now() / 1000) {
      localStorageUtil.removeItem("accessToken");
      return <div>Access token expired</div>;
    }
  } catch (error) {
    console.error(error);
    localStorageUtil.removeItem("accessToken");
    return <div>Invalid access token</div>;
  }

  return <div>{children}</div>;
}
