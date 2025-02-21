import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

import authApi from "@/services/auth.service";
import localStorageUtil from "@/utils/localStorage.util";

export default function ATHandler({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken =
      urlParams.get("accessToken") ?? localStorageUtil.getItem("accessToken");

    if (!accessToken) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    authApi
      .checkAT(accessToken)
      .then(() => {
        console.log("accessToken is valid");
        localStorageUtil.setItem("accessToken", accessToken);
      })
      .catch((error) => {
        console.error(error);
        localStorageUtil.removeItem("accessToken");
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
        <Spinner />
        <div className="text-sm">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
        <div className="text-sm text-secondary-text">
          access token is invalid
        </div>
        {/* <Button
          variant="solid"
          className="bg-secondary-background text-secondary rounded-full"
          onPress={() => {
            localStorageUtil.removeItem("accessToken");
          }}
        >
          Close
        </Button> */}
      </div>
    );
  }

  const accessToken =
    new URLSearchParams(window.location.search).get("accessToken") ||
    localStorageUtil.getItem("accessToken");

  if (!accessToken) {
    return (
      <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
        <div className="text-sm text-secondary-text">
          access token is invalid
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
}
